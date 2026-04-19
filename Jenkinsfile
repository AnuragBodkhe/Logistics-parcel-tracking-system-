pipeline {
    agent any

    environment {
        APP_NAME = "parcel-tracking-app"
    }

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/AnuragBodkhe/Logistics-parcel-tracking-system-.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                echo "Installing Node 20..."
                curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
                apt-get install -y nodejs

                node -v
                npm -v

                npm install
                '''
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                script {
                    sh '''
                    if npm run | grep -q "test"; then
                        npm test
                    else
                        echo "No test script found, skipping..."
                    fi
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            when {
                expression { return sh(script: "which docker || true", returnStatus: true) == 0 }
            }
            steps {
                sh 'docker build -t $APP_NAME .'
            }
        }

        stage('Run Container') {
            when {
                expression { return sh(script: "which docker || true", returnStatus: true) == 0 }
            }
            steps {
                sh '''
                docker stop $APP_NAME || true
                docker rm $APP_NAME || true
                docker run -d -p 3000:3000 --name $APP_NAME $APP_NAME
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Build Successful!'
        }
        failure {
            echo '❌ Build Failed!'
        }
    }
}
