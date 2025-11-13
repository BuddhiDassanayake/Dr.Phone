pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = 'dockerhub-creds'
        DOCKERHUB_USERNAME = 'buddhi2002'
    }

    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/BuddhiDassanayake/Dr.Phone.git',
                    credentialsId: 'github-token'
            }
        }

        stage('Build & Push Frontend') {
            steps {
                withCredentials([usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS, usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh '''
                        # Build frontend Docker image
                        docker build -t ${DOCKERHUB_USERNAME}/drphone-frontend:latest ./frontend

                        # Login and push
                        echo "$PASS" | docker login -u "$USER" --password-stdin
                        docker push ${DOCKERHUB_USERNAME}/drphone-frontend:latest
                        docker logout
                    '''
                }
            }
        }

        stage('Build & Push Backend') {
            steps {
                withCredentials([usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS, usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh '''
                        # Build backend Docker image
                        docker build -t ${DOCKERHUB_USERNAME}/drphone-backend:latest ./backend

                        # Login and push
                        echo "$PASS" | docker login -u "$USER" --password-stdin
                        docker push ${DOCKERHUB_USERNAME}/drphone-backend:latest
                        docker logout
                    '''
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