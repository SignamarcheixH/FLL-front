import client from '~/api/client'

export const Meaning = {
  /* RETRIEVE */
  get (id) {
    return client.axios.get('meanings/' + id)
  },

  /* LIST */
  list (filters) {
    return client.axios.get('meanings/', { params: filters })
  },
  getRandom() {
    return client.axios.get('meanings/random')
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
