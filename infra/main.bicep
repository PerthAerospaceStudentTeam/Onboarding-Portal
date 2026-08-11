// ============================================================
// EDIT THESE — either change the defaults below, or override
// them with --parameters when the workflow runs
// ============================================================

@description('Short lowercase name used to derive resource names.')
param appName string = 'onboarding-portal-prod'

@description('Globally unique, lowercase, alphanumeric only (no hyphens), 5-50 chars.')
param acrName string = 'onboardingportalprodacr'

@description('Azure region.')
param location string = resourceGroup().location

@description('Port your backend listens on inside the container.')
param backendTargetPort int = 8000

@description('Placeholder image for first deploy only. Real image gets pushed in via az containerapp update afterwards, not through this template.')
param backendImage string = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'

@description('Your frontend build output folder.')
param frontendOutputLocation string = 'dist'

// ============================================================
// RESOURCES — shouldn't need edits below this line
// ============================================================

resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: acrName
  location: location
  sku: { name: 'Basic' }
  properties: { adminUserEnabled: true }
}

resource containerAppEnv 'Microsoft.App/managedEnvironments@2026-01-01' = {
  name: '${appName}-env'
  location: location
  properties: {}
}

resource backend 'Microsoft.App/containerApps@2026-01-01' = {
  name: '${appName}-backend'
  location: location
  properties: {
    environmentId: containerAppEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: backendTargetPort
      }
      registries: [
        {
          server: acr.properties.loginServer
          username: acr.listCredentials().username
          passwordSecretRef: 'registry-password'
        }
      ]
      secrets: [
        {
          name: 'registry-password'
          value: acr.listCredentials().passwords[0].value
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'backend'
          image: backendImage
        }
      ]
    }
  }
}

resource frontend 'Microsoft.Web/staticSites@2025-03-01' = {
  name: '${appName}-frontend'
  location: 'eastasia'
  sku: { name: 'Free' }
  properties: {
    buildProperties: {
      appLocation: '/frontend'
      outputLocation: frontendOutputLocation
    }
  }
}

output acrLoginServer string = acr.properties.loginServer
output backendAppName string = backend.name
output frontendName string = frontend.name
