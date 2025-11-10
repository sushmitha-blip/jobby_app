import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  INITIAL: 'INITIAL',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  IN_PROGRESS: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.INITIAL,
    jobDetails: {},
    similarJobs: [],
  }

  componentDidMount() {
    this.fetchJobDetails()
  }

  fetchJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.IN_PROGRESS})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {id} = match.params

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      this.setState({
        jobDetails: data.job_details,
        similarJobs: data.similar_jobs,
        apiStatus: apiStatusConstants.SUCCESS,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.FAILURE})
    }
  }

  renderSkills = skills => (
    <ul>
      {skills.map(skill => (
        <li key={skill.name}>
          <img src={skill.image_url} alt={skill.name} />
          <p>{skill.name}</p>
        </li>
      ))}
    </ul>
  )

  renderSimilarJobs = similarJobs => (
    <ul>
      {similarJobs.map(job => (
        <li key={job.id}>
          <img src={job.company_logo_url} alt="similar job company logo" />
          <h1>{job.title}</h1>
          <p>{job.rating}</p>
          <h1>Description</h1>
          <p>{job.job_description}</p>
          <p>{job.location}</p>
          <p>{job.employment_type}</p>
        </li>
      ))}
    </ul>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.fetchJobDetails}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      title,
      rating,
      location,
      package_per_annum,
      employment_type,
      company_website_url,
      job_description,
      company_logo_url,
      skills,
      life_at_company,
    } = jobDetails

    return (
      <div>
        <img src={company_logo_url} alt="job details company logo" />
        <h1>{title}</h1>
        <p>{rating}</p>
        <p>{location}</p>
        <p>{employment_type}</p>
        <p>{package_per_annum}</p>
        <hr />
        <div>
          <h1>Description</h1>
          <a
            href={company_website_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button type="button">Visit</button>
          </a>
        </div>
        <p>{job_description}</p>
        <h1>Skills</h1>
        {this.renderSkills(skills)}
        <h1>Life at Company</h1>
        <div>
          <p>{life_at_company.description}</p>
          <img src={life_at_company.image_url} alt="life at company" />
        </div>

        <h1>Similar Jobs</h1>
        {this.renderSimilarJobs(similarJobs)}
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state

    return (
      <>
        <Header />
        <div>
          {(() => {
            switch (apiStatus) {
              case apiStatusConstants.IN_PROGRESS:
                return this.renderLoader()
              case apiStatusConstants.SUCCESS:
                return this.renderSuccessView()
              case apiStatusConstants.FAILURE:
                return this.renderFailureView()
              default:
                return null
            }
          })()}
        </div>
      </>
    )
  }
}
export default withRouter(JobItemDetails)
/*const jobDetails = {
        id: data.job_details.id,
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
        lifeAtCompany: {
          description: data.job_details.lifeAtCompany.description,
          imageUrl: data.job_details.lifeAtCompany.image_url,
        },
        skills: data.job_details.skills.map(skill => ({
          name: skill.name,
          imageUrl: skill.image_url,
        })),
      }
      const similarJobs = data.similar_jobs.map(job => ({
        id: job.id,
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        jobDescription: job.job_description,
        location: job.location,
        rating: job.rating,
        title: job.title,
      }))*/
