# 建立環境 - 透過 CDK 建置 EKS cluster

1. 安裝 CDK，在驗證時安裝版本為 `2.87.0`。
```
$ npm i -g aws-cdk

$ cdk --version
2.87.0 (build 9fca790)
```
2. 初始化專案。
```
$ cdk init sample-app --language=typescript
Applying project template sample-app for typescript
# Welcome to your CDK TypeScript project

You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`CdkStack`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

Executing npm install...
✅ All done!
```

3. 安裝相應套件並 bootstrap CDK。
```
$ npm install @aws-cdk/lambda-layer-kubectl-v26 --save-dev
added 1 package, and audited 345 packages in 15s

33 packages are looking for funding
  run `npm fund` for details

21 moderate severity vulnerabilities

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
```
```
$ cdk bootstrap
 ⏳  Bootstrapping environment aws://111111111111/eu-west-1...
Trusted accounts for deployment: (none)
Trusted accounts for lookup: (none)
Using default execution policy of 'arn:aws:iam::aws:policy/AdministratorAccess'. Pass '--cloudformation-execution-policies' to customize.
CDKToolkit: creating CloudFormation changeset...
 ✅  Environment aws://111111111111/eu-west-1 bootstrapped.
```
4. 更新以下 CDK `/lib/cdk-stack.ts` 目錄程式碼：
```
$ import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { KubectlV26Layer } from '@aws-cdk/lambda-layer-kubectl-v26';

import { Construct } from 'constructs';

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const kubectl = new KubectlV26Layer(this, 'KubectlLayer');
    const cluster = new eks.Cluster(this, 'HelloEKS', {
      version: eks.KubernetesVersion.V1_26, 
      kubectlLayer: new KubectlV26Layer(this, 'kubectl'), 
      defaultCapacity: 2,
      defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
    });

  }
}
```
5. 使用 `cdk deploy` 命令部署 CDK Stack ，最終花費 1035.84s 約 17 分鐘。
```
$ cdk deploy

✨  Synthesis time: 4.96s

This deployment will make potentially sensitive changes according to your current security approval level (--require-approval broadening).
Please confirm you intend to make the following modifications:

IAM Statement Changes
┌───┬──────────────────────────────────────────────────────────────────┬────────┬──────────────────────────────────────────────────────────────────┬────────────────────────────────────────────────────────────────────┬───────────┐
│   │ Resource                                                         │ Effect │ Action                                                           │ Principal                                                          │ Condition │
├───┼──────────────────────────────────────────────────────────────────┼────────┼──────────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────┼───────────┤
│ + │ ${Custom::VpcRestrictDefaultSGCustomResourceProvider/Role.Arn}   │ Allow  │ sts:AssumeRole                                                   │ Service:lambda.amazonaws.com                                       │           │
├───┼──────────────────────────────────────────────────────────────────┼────────┼──────────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────┼───────────┤
│ + │ ${HelloEKS/Resource/Resource.Arn}                                │ Allow  │ eks:DescribeCluster                                              │ AWS:${HelloEKS/KubectlHandlerRole}                                 │           │
├───┼──────────────────────────────────────────────────────────────────┼────────┼──────────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────┼───────────┤
│ + │ ${HelloEKS/Resource/CreationRole.Arn}                            │ Allow  │ sts:AssumeRole                                                   │ AWS:${HelloEKS/KubectlHandlerRole.Arn}                             │           │
│   │                                                                  │        │                                                                  │ AWS:${@aws-cdk--aws-eks.ClusterResourceProvider.NestedStack/@aws-c │           │
│   │                                                                  │        │                                                                  │ dk--aws-eks.ClusterResourceProvider.NestedStackResource.Outputs.Cd │           │
│   │                                                                  │        │                                                                  │ kStackawscdkawseksClusterResourceProviderIsCompleteHandlerServiceR │           │
│   │                                                                  │        │                                                                  │ ole10004BC8Arn}                                                    │           │
│   │                                                                  │        │                                                                  │ AWS:${@aws-cdk--aws-eks.ClusterResourceProvider.NestedStack/@aws-c │           │
│   │                                                                  │        │                                                                  │ dk--aws-eks.ClusterResourceProvider.NestedStackResource.Outputs.Cd │           │
│   │                                                                  │        │                                                                  │ kStackawscdkawseksClusterResourceProviderOnEventHandlerServiceRole │           │
│   │                                                                  │        │                                                                  │ 6CFF6D1DArn}                                                       │           │
│ + │ ${HelloEKS/Resource/CreationRole.Arn}                            │ Allow  │ sts:AssumeRole                                                   │ AWS:${HelloEKS/KubectlHandlerRole}                                 │           │
├───┼──────────────────────────────────────────────────────────────────┼────────┼──────────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────┼───────────┤
│ + │ ${HelloEKS/KubectlHandlerRole.Arn}                               │ Allow  │ sts:AssumeRole                                                   │ Service:lambda.amazonaws.com                                       │           │
├───┼──────────────────────────────────────────────────────────────────┼────────┼──────────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────┼───────────┤
│ + │ ${HelloEKS/NodegroupDefaultCapacity/NodeGroupRole.Arn}           │ Allow  │ sts:AssumeRole                                                   │ Service:ec2.amazonaws.com                                          │           │
├───┼──────────────────────────────────────────────────────────────────┼────────┼──────────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────┼───────────┤
│ + │ ${HelloEKS/Role.Arn}                                             │ Allow  │ sts:AssumeRole                                                   │ Service:eks.amazonaws.com                                          │           │
│ + │ ${HelloEKS/Role.Arn}                                             │ Allow  │ iam:PassRole                                                     │ AWS:${HelloEKS/Resource/CreationRole}                              │           │
├───┼──────────────────────────────────────────────────────────────────┼────────┼──────────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────┼───────────┤
│ + │ *                                                                │ Allow  │ eks:CreateCluster                                                │ AWS:${HelloEKS/Resource/CreationRole}                              │           │
│   │                                                                  │        │ eks:CreateFargateProfile                                         │                                                                    │           │
│   │                                                                  │        │ eks:DeleteCluster                                                │                                                                    │           │
│   │                                                                  │        │ eks:DescribeCluster                                              │                                                                    │           │
│   │                                                                  │        │ eks:DescribeUpdate                                               │                                                                    │           │
│   │                                                                  │        │ eks:TagResource                                                  │                                                                    │           │
│   │                                                                  │        │ eks:UntagResource                                                │                                                                    │           │
│   │                                                                  │        │ eks:UpdateClusterConfig                                          │                                                                    │           │
│   │                                                                  │        │ eks:UpdateClusterVersion                                         │                                                                    │           │
│ + │ *                                                                │ Allow  │ eks:DeleteFargateProfile                                         │ AWS:${HelloEKS/Resource/CreationRole}                              │           │
│   │                                                                  │        │ eks:DescribeFargateProfile                                       │                                                                    │           │
│ + │ *                                                                │ Allow  │ ec2:DescribeDhcpOptions                                          │ AWS:${HelloEKS/Resource/CreationRole}                              │           │
│   │                                                                  │        │ ec2:DescribeInstances                                            │                                                                    │           │
│   │                                                                  │        │ ec2:DescribeNetworkInterfaces                                    │                                                                    │           │
│   │                                                                  │        │ ec2:DescribeRouteTables                                          │                                                                    │           │
│   │                                                                  │        │ ec2:DescribeSecurityGroups                                       │                                                                    │           │
│   │                                                                  │        │ ec2:DescribeSubnets                                              │                                                                    │           │
│   │                                                                  │        │ ec2:DescribeVpcs                                                 │                                                                    │           │
│   │                                                                  │        │ iam:CreateServiceLinkedRole                                      │                                                                    │           │
│   │                                                                  │        │ iam:GetRole                                                      │                                                                    │           │
│   │                                                                  │        │ iam:listAttachedRolePolicies                                     │                                                                    │           │
├───┼──────────────────────────────────────────────────────────────────┼────────┼──────────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────┼───────────┤
│ + │ arn:${AWS::Partition}:ec2:${AWS::Region}:${AWS::AccountId}:secur │ Allow  │ ec2:AuthorizeSecurityGroupEgress                                 │ AWS:${Custom::VpcRestrictDefaultSGCustomResourceProvider/Role}     │           │
│   │ ity-group/${HelloEKSDefaultVpc597961A2.DefaultSecurityGroup}     │        │ ec2:AuthorizeSecurityGroupIngress                                │                                                                    │           │
│   │                                                                  │        │ ec2:RevokeSecurityGroupEgress                                    │                                                                    │           │
│   │                                                                  │        │ ec2:RevokeSecurityGroupIngress                                   │                                                                    │           │
└───┴──────────────────────────────────────────────────────────────────┴────────┴──────────────────────────────────────────────────────────────────┴────────────────────────────────────────────────────────────────────┴───────────┘
IAM Policy Changes
┌───┬────────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   │ Resource                                                   │ Managed Policy ARN                                                                                                               │
├───┼────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ + │ ${Custom::VpcRestrictDefaultSGCustomResourceProvider/Role} │ {"Fn::Sub":"arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"}                                     │
├───┼────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ + │ ${HelloEKS/KubectlHandlerRole}                             │ arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole                                                   │
│ + │ ${HelloEKS/KubectlHandlerRole}                             │ arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole                                               │
│ + │ ${HelloEKS/KubectlHandlerRole}                             │ arn:${AWS::Partition}:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly                                                         │
│ + │ ${HelloEKS/KubectlHandlerRole}                             │ {"Fn::If":["HelloEKSHasEcrPublic372F637E","arn:${AWS::Partition}:iam::aws:policy/AmazonElasticContainerRegistryPublicReadOnly"]} │
├───┼────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ + │ ${HelloEKS/NodegroupDefaultCapacity/NodeGroupRole}         │ arn:${AWS::Partition}:iam::aws:policy/AmazonEKSWorkerNodePolicy                                                                  │
│ + │ ${HelloEKS/NodegroupDefaultCapacity/NodeGroupRole}         │ arn:${AWS::Partition}:iam::aws:policy/AmazonEKS_CNI_Policy                                                                       │
│ + │ ${HelloEKS/NodegroupDefaultCapacity/NodeGroupRole}         │ arn:${AWS::Partition}:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly                                                         │
├───┼────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ + │ ${HelloEKS/Role}                                           │ arn:${AWS::Partition}:iam::aws:policy/AmazonEKSClusterPolicy                                                                     │
└───┴────────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
Security Group Changes
┌───┬───────────────────────────────────────────────┬─────┬────────────┬─────────────────┐
│   │ Group                                         │ Dir │ Protocol   │ Peer            │
├───┼───────────────────────────────────────────────┼─────┼────────────┼─────────────────┤
│ + │ ${HelloEKS/ControlPlaneSecurityGroup.GroupId} │ Out │ Everything │ Everyone (IPv4) │
└───┴───────────────────────────────────────────────┴─────┴────────────┴─────────────────┘
(NOTE: There may be security-related changes not in this list. See https://github.com/aws/aws-cdk/issues/1299)

Do you wish to deploy these changes (y/n)? y
CdkStack: deploying... [1/1]
CdkStack: creating CloudFormation changeset...
[████████████████████████████████████████████████▌·········] (36/43)

 ✅  CdkStack

✨  Deployment time: 1030.88s

Stack ARN:
arn:aws:cloudformation:eu-west-1:111111111111:stack/CdkStack/fee32500-1f39-11ee-b427-0242d4d85689

✨  Total time: 1035.84s
```

## CloudFormation CLI 輸出

```
$ aws cloudformation describe-stack-resources --stack-name CdkStack --query 'StackResources[?ResourceType==`AWS::CloudFormation::Stack`]'
[
    {
        "StackName": "CdkStack",
        "StackId": "arn:aws:cloudformation:eu-west-1:111111111111:stack/CdkStack/fee32500-1f39-11ee-b427-0242d4d85689",
        "LogicalResourceId": "awscdkawseksClusterResourceProviderNestedStackawscdkawseksClusterResourceProviderNestedStackResource9827C454",
        "PhysicalResourceId": "arn:aws:cloudformation:eu-west-1:111111111111:stack/CdkStack-awscdkawseksClusterResourceProviderNestedStackawscdkawseksClusterResourceProv-1G8GRB50HLVGO/0983c960-1f3a-11ee-9f12-06ecfad48bb3",
        "ResourceType": "AWS::CloudFormation::Stack",
        "Timestamp": "2023-07-10T15:56:16.107000+00:00",
        "ResourceStatus": "CREATE_COMPLETE",
        "DriftInformation": {
            "StackResourceDriftStatus": "NOT_CHECKED"
        }
    },
    {
        "StackName": "CdkStack",
        "StackId": "arn:aws:cloudformation:eu-west-1:111111111111:stack/CdkStack/fee32500-1f39-11ee-b427-0242d4d85689",
        "LogicalResourceId": "awscdkawseksKubectlProviderNestedStackawscdkawseksKubectlProviderNestedStackResourceA7AEBA6B",
        "PhysicalResourceId": "arn:aws:cloudformation:eu-west-1:111111111111:stack/CdkStack-awscdkawseksKubectlProviderNestedStackawscdkawseksKubectlProviderNestedStackR-H8CE759H0XAJ/cbdcc9c0-1f3b-11ee-9434-02d377dafc71",
        "ResourceType": "AWS::CloudFormation::Stack",
        "Timestamp": "2023-07-10T16:10:59.995000+00:00",
        "ResourceStatus": "CREATE_COMPLETE",
        "DriftInformation": {
            "StackResourceDriftStatus": "NOT_CHECKED"
        }
    }
]
```

```
$ aws cloudformation describe-stack-resources --stack-name CdkStack-awscdkawseksKubectlProviderNestedStackawscdkawseksKubectlProviderNestedStackR-H8CE759H0XAJ --query 'StackResources[?ResourceType==`AWS::Lambda::Function`]'
[
    {
        "StackName": "CdkStack-awscdkawseksKubectlProviderNestedStackawscdkawseksKubectlProviderNestedStackR-H8CE759H0XAJ",
        "StackId": "arn:aws:cloudformation:eu-west-1:111111111111:stack/CdkStack-awscdkawseksKubectlProviderNestedStackawscdkawseksKubectlProviderNestedStackR-H8CE759H0XAJ/cbdcc9c0-1f3b-11ee-9434-02d377dafc71",
        "LogicalResourceId": "Handler886CB40B",
        "PhysicalResourceId": "CdkStack-awscdkawseksKubectlProvid-Handler886CB40B-FZSz6Yy1O8De",
        "ResourceType": "AWS::Lambda::Function",
        "Timestamp": "2023-07-10T16:10:19.525000+00:00",
        "ResourceStatus": "CREATE_COMPLETE",
        "DriftInformation": {
            "StackResourceDriftStatus": "NOT_CHECKED"
        }
    },
    {
        "StackName": "CdkStack-awscdkawseksKubectlProviderNestedStackawscdkawseksKubectlProviderNestedStackR-H8CE759H0XAJ",
        "StackId": "arn:aws:cloudformation:eu-west-1:111111111111:stack/CdkStack-awscdkawseksKubectlProviderNestedStackawscdkawseksKubectlProviderNestedStackR-H8CE759H0XAJ/cbdcc9c0-1f3b-11ee-9434-02d377dafc71",
        "LogicalResourceId": "ProviderframeworkonEvent83C1D0A7",
        "PhysicalResourceId": "CdkStack-awscdkawseksKube-ProviderframeworkonEvent-KKb8fWfANAXH",
        "ResourceType": "AWS::Lambda::Function",
        "Timestamp": "2023-07-10T16:10:46.567000+00:00",
        "ResourceStatus": "CREATE_COMPLETE",
        "DriftInformation": {
            "StackResourceDriftStatus": "NOT_CHECKED"
        }
    }
]
```
