################################
# EC2 Instance
################################
resource "aws_instance" "app_server" {
  ami           = "ami-04b4f1a9cf54c11d0" # Ubuntu 24.04
  instance_type = "t3.micro"

  key_name               = aws_key_pair.kp.key_name
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  tags = {
    Name = "DrPhone-Server"
  }
}