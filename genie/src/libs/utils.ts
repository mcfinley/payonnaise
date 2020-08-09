export const parse = <T>(data: string) => new Promise<T>((resolve, reject) => {
  try {
    resolve(JSON.parse(data))
  } catch (e) {
    reject(e)
  }
})

export const stringify = <T>(data: T) => Promise.resolve(JSON.stringify(data))