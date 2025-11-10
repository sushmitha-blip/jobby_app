import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

class Profile extends Component {
  state = {
    profileData: null,
    apiStatus: 'INITIAL',
  }

  componentDidMount() {
    this.getProfileData()
  }

  getProfileData = async () => {
    this.setState({apiStatus: 'IN_PROGRESS'})
    const apiUrl = 'https://apis.ccbp.in/profile'
    const response = await fetch(apiUrl)
    if (response.ok) {
      const data = await response.json()
      const formattedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileData: formattedData,
        apiStatus: 'SUCCESS',
      })
    } else {
      this.setState({apiStatus: 'FAILURE'})
    }
  }

  renderSuccessView = () => {
    const {profileData} = this.state
    const {profileImageUrl, name, shortBio} = profileData
    return (
      <div className="profile-con">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="name">{name}</h1>
        <p className="descript">{shortBio}</p>
      </div>
    )
  }

  onFailureView = () => (
    <div>
      <button type="button" onClick={this.getProfileData}>
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfile = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'IN_PROGRESS':
        return this.renderLoaderView()
      case 'SUCCESS':
        return this.renderSuccessView()
      case 'FAILURE':
        return this.onFailureView()
      default:
        return null
    }
  }

  render() {
    return <div>{this.renderProfile()}</div>
  }
}
export default Profile
