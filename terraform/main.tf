################################
# Get Default VPC
################################
data "aws_vpc" "default" {
  default = true
}

################################
# SSH Key Setup
################################
resource "tls_private_key" "pk" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "kp" {
  key_name   = "drphone-key-final-99"
  public_key = tls_private_key.pk.public_key_openssh
}

resource "local_file" "ssh_key" {
  filename = "drphone_key.pem"
  content  = tls_private_key.pk.private_key_pem
  file_permission = "0400"
}

################################
# Security Group (Default VPC)
################################
resource "aws_security_group" "app_sg" {
  name        = "drphone-sg-v2"
  description = "Allow App Ports"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}



################################
# Elastic IP (Static IP)
################################
resource "aws_eip" "static_ip" {
  instance = aws_instance.app_server.id
  domain   = "vpc"
}

################################
# Outputs
################################
output "public_ip" {
  value = aws_eip.static_ip.public_ip
}

output "ssh_command" {
  value = "ssh -i drphone_key.pem ubuntu@${aws_eip.static_ip.public_ip}"
}

output "jenkins_url" {
  value = "http://${aws_eip.static_ip.public_ip}:8080"
}

output "frontend_url" {
  value = "http://${aws_eip.static_ip.public_ip}"
}

output "backend_url" {
  value = "http://${aws_eip.static_ip.public_ip}:3000"
}
