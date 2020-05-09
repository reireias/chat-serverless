export default ({ route, store, redirect }) => {
  if (store.getters.isAuth) {
    if (route.name !== 'index') {
      redirect('/')
    }
  } else if (route.name !== 'login') {
    redirect('/login')
  }
}
