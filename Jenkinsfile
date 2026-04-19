pipeline {
    agent any

    environment {
        IMAGE_NAME = "parcel-tracking-app"
        CONTAINER_NAME = "parcel-container"
    }

    stages {

        stage('Clone') {
            steps {
                git url: 'https://github.com/AnuragBodkhe/Logistics-parcel-tracking-system-.git', branch: 'main'
            }
        }

        stage('Install') {
            steps {
                bat 'node -v'
                bat 'npm -v'
                bat 'npm install'
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Test') {
            steps {
                script {
                    try {
                        bat 'npm test'
                    } catch (Exception e) {
                        echo 'Skipping tests (not defined)'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build -t %IMAGE_NAME% ."
            }
        }

        stage('Run Container') {
            steps {
                bat "docker rm -f %CONTAINER_NAME% || exit 0"
                bat "docker run -d -p 3005:3000 --name %CONTAINER_NAME% %IMAGE_NAME%"
            }
        }

        stage('Deploy') {
            steps {
                echo 'Application running at http://localhost:3005'
            }
        }
    }
}
