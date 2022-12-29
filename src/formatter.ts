/*  Open Api to Api Gate way converter (this will do the 90% of the work) */
export type API_OBJECT = {
  [key: string]: {
    [key: string]: {
      security: { [key: string]: [] }[],
      operationId: string,
      responses: { [key: string]: object },
      parameters?: { in: string }[],
      description: string
    }
  } & { parameters?: { in: string }[], security?: string[] }
}
// ! change this. mostly used patter /<app-slug>/<version>/<service-name>
function slugify(method: string, prepend: string, path: string) {
  return `${method}${prepend.replace(/\//g, '-')}${path.replace(/\//g, '-')}`.replace(/[\])}[{(]/g, '')
}
function formatParam(param: { schema: { type: string, example: string }, name: string, in: string, description: string, required?: boolean }) {
  const { schema, ...rest } = param
  if (rest.in === 'path')
    return { ...rest, required: true, type: schema ? schema.type : 'string' }
  return { ...rest, schema, required: rest.required || false, type: schema ? schema.type : 'string' }
}
export function format(ApiObject: API_OBJECT, prepend: string = '/hr/v1') {
  console.log(ApiObject)
  const formattedObject: any = {}
  Object.keys(ApiObject).forEach(key => {
    const pathObject = ApiObject[key]
    // if(key.includes(/\{.*?\}/g)) parameters should be defined
    const keys = ['get', 'post', 'put', 'delete', 'patch']
    for (const path in pathObject) {
      if (keys.includes(path)) {
        pathObject[path] = {
          description: pathObject[path]?.description || "",
          operationId: slugify(path, prepend, key),
          security: ((pathObject.security && pathObject.security.length) || (pathObject[path]?.security && pathObject[path]?.security.length)) ? [{ api_key: [] }, { pypa_auth: [] }] : [{ api_key: [] }],
          // @ts-ignore
          responses: { [Object.keys(pathObject[path]?.responses)[0]]: { description: Object.values(pathObject[path]?.responses)[0].description } },
          // @ts-ignore
          ...((pathObject[path]?.parameters && pathObject[path]?.parameters?.filter(param => param.in == 'path').length) && { parameters: pathObject[path].parameters!.filter(param => param.in == 'path').map(formatParam) })
        }
      }
      if (path === 'parameters') {
        if (pathObject[path] && pathObject[path]!.filter(param => param.in == 'path').length) {
          // @ts-ignore
          pathObject[path] = pathObject[path]!.filter(param => param.in == 'path').map(formatParam)
        } else {
          delete pathObject[path]
        }
      }
    }
    formattedObject[`${prepend + key}`] = pathObject
  })
  return formattedObject
}