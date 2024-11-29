pipeline {
 agent {
    node {
        label 'my-defined-label'
        customWorkspace '/some/other/path'
    }
}

    stages {
        stage('Build') {
            steps {
                sh "docker ps"
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}
