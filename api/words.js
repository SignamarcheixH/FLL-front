import client from '~/api/client'

export const Word = {
  /* RETRIEVE */
  get (id) {
    return client.axios.get('words/' + id)
  },

  /* LIST */
  list (filters) {
    return client.axios.get('words/', { params: filters })
  },
  getRandom() {
    return client.axios.get('words/random')
  },

  // /* POST */
  // post (data) {
  //   return client.axios.post('associated-themes', data)
  // },
  // put (id, data) {
  //   return client.axios.put('associated-themes/' + id, data)
  // },

  // /* DESTROY */
  // delete (id) {
  //   return client.axios.delete('associated-themes/' + id)
  // }
}
