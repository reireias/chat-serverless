export default ({ route, store, redirect }) => {
  if (store.getters.isAuth) {
    if (route.name === 'login') {
      redirect('/')
    }
  } else if (route.name !== 'login') {
    redirect('/login')
  }
}
