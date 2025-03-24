import { Amplify } from 'aws-amplify'
import awsconfig from '../aws-exports'

function configureAmplify() {
  Amplify.configure(awsconfig)
}

export default configureAmplify 