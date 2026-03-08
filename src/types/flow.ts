export interface CreateFlowRequest {
  title: string
  description: string
  imageTypes: string[]
}

export interface CompleteS3Request {
  imageId: number
  expectedObjectKey: string
}
