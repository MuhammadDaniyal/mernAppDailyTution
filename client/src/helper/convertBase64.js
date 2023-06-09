// The readAsDataURL() method returns an object with the result property that contains the data as a data: URL. The data:URL represents the file’s data as a base64 encoded string.

/** image onto base64 */
export function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result)
        }

        fileReader.onerror = (error) => {
            reject(error)
        }
    })
}