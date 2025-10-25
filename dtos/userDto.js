export default class UserDto {
  email
  id
  isActivated

  constructor(user) {
    this.email = user.email
    this.id = user._id
    this.isActivated = user.isActivated
  }
}
