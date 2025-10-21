export default class UserDto {
  email
  id
  isActivated

  constructor(model) {
    this.model = model.email
    this.id = model._id
    this.isActivated = model.isActivated
  }
}
