declare namespace Express {
  export interface Request {
    clientIp: string
    rawBody?: string
  }
}
