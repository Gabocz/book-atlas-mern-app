export const axiosError = (res) => {
   if(res.name === 'AxiosError') {
     res.errorMessage = res.response.data.msg
     return true
   }
}
