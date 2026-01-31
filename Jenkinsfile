pipeline {
    agent any

environment {
    EC2_HOST = "ubuntu@34.194.249.13"
    SSH_KEY_ID = "ec2-ssh-key"
    FRONTEND_IMAGE = "buddhi2002/drphone-frontend:latest"
    BACKEND_IMAGE = "buddhi2002/drphone-backend:latest"
}

    stages {

        stage('Clone Repo') {
            steps {
                echo "🔄 Stage: Clone Repo - Pulling code from GitHub"
                git branch: 'main', 
                    url: 'https://github.com/BuddhiDassanayake/Dr.Phone.git', 
                    credentialsId: 'git-PAT'
                echo "✅ Code cloned successfully"
            }
        }

stage('Build Frontend Docker Image') {
    steps {
        echo "🛠 Building Frontend Docker Image"
        sh "docker build -t $FRONTEND_IMAGE ./frontend"
        echo "✅ Frontend image built"
    }
}

stage('Build Backend Docker Image') {
    steps {
        echo "🛠 Building Backend Docker Image"
        sh "docker build -t $BACKEND_IMAGE ./backend"
        echo "✅ Backend image built"
    }
}

stage('Push Frontend Docker Image') {
    steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            sh '''
                echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                docker push $FRONTEND_IMAGE
            '''
        }
    }
}

stage('Push Backend Docker Image') {
    steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            sh '''
                echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                docker push $BACKEND_IMAGE
            '''
        }
    }
}

        stage('Test SSH Connection') {
            steps {
                echo "🔑 Stage: Test SSH Connection to EC2"
                sshagent([SSH_KEY_ID]) {
                    sh "ssh -o StrictHostKeyChecking=no $EC2_HOST 'echo SSH connection to EC2 works!'"
                }
                echo "✅ SSH connection test passed"
            }
        }

   stage('Deploy on EC2') {
    steps {
        echo "🚀 Deploying Frontend & Backend on EC2"
        sshagent([SSH_KEY_ID]) {
            sh """
            ssh -o StrictHostKeyChecking=no $EC2_HOST '
                echo "📥 Pulling frontend image $FRONTEND_IMAGE" &&
                docker pull $FRONTEND_IMAGE &&
                echo "📥 Pulling backend image $BACKEND_IMAGE" &&
                docker pull $BACKEND_IMAGE &&
                cd /home/ubuntu/Dr.Phone &&
                echo "🛠 Stopping existing containers" &&
                docker-compose down &&
                echo "📦 Starting containers" &&
                docker-compose up -d &&
                echo "✅ Deployment completed"
            '
            """
        }
    }
}


    post {
        success {
            echo "🎉 Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed. Check logs for errors."
        }
    }
}
