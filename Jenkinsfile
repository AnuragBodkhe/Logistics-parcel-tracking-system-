pipeline {
    agent any

    environment {
        APP_NAME = "parcel-tracking-app"
        PORT = "4000"   // external port (changed)
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/AnuragBodkhe/Logistics-parcel-tracking-system-.git'
            }
        }

        stage('Build App') {
            steps {
                sh '''
                curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
                apt-get install -y nodejs

                npm install
                npm run build
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $APP_NAME .'
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                docker stop $APP_NAME || true
                docker rm $APP_NAME || true

                docker run -d -p $PORT:80 \
                --name $APP_NAME $APP_NAME
                '''
            }
        }
    }

    post {
        success {
            echo "✅ App is running on http://localhost:4000"
        }
        failure {
            echo "❌ Build failed"
        }
    }
}
