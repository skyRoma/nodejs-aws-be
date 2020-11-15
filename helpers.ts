export function createResponse(statusCode: number, body: any) {
  return {
    headers: { 'Access-Control-Allow-Origin': '*' },
    statusCode,
    body: JSON.stringify(body),
  };
}
