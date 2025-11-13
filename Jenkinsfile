pipeline {
    agent any

    environment {
        // Jenkins Docker Hub credentials ID
        DOCKERHUB_CREDENTIALS = 'dockerhub-creds'
        DOCKERHUB_USERNAME = 'buddhi2002'
    }

    stages {
        // 1. Clone GitHub repository
        stage('Clone Repository') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/BuddhiDassanayake/Dr.Phone.git',
                    credentialsId: 'github-token'

                // Verify clone
                sh 'echo "Repository cloned successfully!"'
                sh 'ls -l'
            }
        }

        // 2. Build Frontend Docker image
        stage('Build Frontend Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKERHUB_USERNAME}/drphone-frontend:latest ./frontend"
                }
            }
        }

        // 3. Build Backend Docker image
        stage('Build Backend Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKERHUB_USERNAME}/drphone-backend:latest ./backend"
                }
            }
        }

        // 4. Push Frontend Docker image
        stage('Push Frontend Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS, usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh "echo $PASS | docker login -u $USER --password-stdin"
                        sh "docker push ${DOCKERHUB_USERNAME}/drphone-frontend:latest"
                    }
                }
            }
        }

        // 5. Push Backend Docker image
        stage('Push Backend Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS, usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh "echo $PASS | docker login -u $USER --password-stdin"
                        sh "docker push ${DOCKERHUB_USERNAME}/drphone-backend:latest"
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished."
        }
    }
}
