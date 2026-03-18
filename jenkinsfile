pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Pulling code...'
            }
        }

        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying app...'
            }
        }
    }
}
