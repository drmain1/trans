# HealthScribe MVP

A physician transcription system using AWS HealthScribe to automate clinical documentation from patient-clinician conversations.

## Overview

This application allows physicians to:
- Record patient-clinician conversations
- Process them through AWS HealthScribe to generate clinical documentation
- Edit and review the generated clinical notes
- Export the notes to electronic health record (EHR) systems

## Features

- **Recording Interface**: Capture patient-clinician conversations
- **Transcription Processing**: Utilize AWS HealthScribe for analysis and documentation
- **Review Interface**: View and edit generated notes
- **EHR Integration**: Export notes to electronic health record systems

## Technology Stack

- **Frontend**: React.js
- **Authentication**: AWS Cognito
- **Storage**: Amazon S3
- **Processing**: AWS HealthScribe, AWS Lambda
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 18.x or later
- AWS Account with appropriate permissions
- AWS CLI configured locally

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/healthscribe-mvp.git
   cd healthscribe-mvp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure AWS Amplify**
   
   Update the `src/aws-exports.js` file with your AWS credentials and configuration.

4. **Run the development server**
   ```bash
   npm start
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000)

## Deployment

This application is designed to be deployed using AWS Amplify. See the detailed deployment instructions in the project documentation.

## HIPAA Compliance

This application is designed with HIPAA compliance in mind:
- All data is encrypted at rest and in transit
- Authentication is required for all user interactions
- Access controls limit information visibility
- Audit logging tracks all activities

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- AWS HealthScribe for transcription and clinical documentation
- AWS Amplify for frontend hosting and authentication 