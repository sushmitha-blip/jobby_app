import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {Link, withRouter} from 'react-router-dom'

import {BsSearch} from 'react-icons/bs'

import Profile from '../Profile'

import FiltersGroup from '../FiltersGroup'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  INITIAL: 'INITIAL',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  IN_PROGRESS: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    searchInput: '',
    salaryRange: '',
    employmentType: [],
    apiStatus: apiStatusConstants.INITIAL,
  }

  componentDidMount() {
    this.getJobsData()
  }

  getJobsData = async () => {
    this.setState({apiStatus: apiStatusConstants.IN_PROGRESS})

    const jwtToken = Cookies.get('jwt_token')
    const {employmentType, salaryRange, searchInput} = this.state
    const employmentTypeStr = employmentType.join(',')
    const salaryStr = salaryRange
    const searchStr = searchInput.trim()

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeStr}&minimum_package=${salaryStr}&search=${searchStr}`
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
        jobsList: data.jobs,
        apiStatus: apiStatusConstants.SUCCESS,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.FAILURE})
    }
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    this.getJobsData()
  }

  onChangeEmploymentType = typeId => {
    this.setState(
      prevState => {
        const updated = prevState.employmentType.includes(typeId)
          ? prevState.employmentType.filter(id => id !== typeId)
          : [...prevState.employmentType, typeId]
        return {employmentType: updated}
      },
      () => this.getJobsData(),
    )
  }

  onChangeSalaryRange = rangeId => {
    this.setState({salaryRange: rangeId}, this.getJobsData)
  }

  onFailureOfRequest = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.getJobsData}>
        Retry
      </button>
    </div>
  )

  renderNoJobsView = () => (
    <div className="no-jobs-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1 className="heading">No Jobs Found</h1>
      <p className="descript">We could not find any jobs. Try other filters</p>
    </div>
  )

  renderJobsList = () => {
    const {jobsList} = this.state
    if (jobsList.length === 0) {
      return this.renderNoJobsView()
    }

    return (
      <ul>
        {jobsList.map(job => (
          <li key={job.id}>
            <Link to={`/jobs/${job.id}`}>
              <img src={job.company_logo_url} alt="company logo" />
              <h1>{job.title}</h1>
              <p>{job.rating}</p>
              <p>{job.location}</p>
              <p>{job.employment_type}</p>
              <p>{job.package_per_annum}</p>
              <hr />
              <h1>Description</h1>
              <p>{job.job_description}</p>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsConent = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.IN_PROGRESS:
        return this.renderLoader()
      case apiStatusConstants.SUCCESS:
        return this.renderJobsList()
      case apiStatusConstants.FAILURE:
        return this.onFailureOfRequest()
      default:
        return null
    }
  }

  render() {
    const {searchInput, employmentType, salaryRange} = this.state

    return (
      <>
        <Header />
        <div>
          <aside>
            <Profile />
            <hr />
            <FiltersGroup
              employmentType={employmentType}
              salaryRange={salaryRange}
              onChangeEmploymentType={this.onChangeEmploymentType}
              onChangeSalaryRange={this.onChangeSalaryRange}
            />
          </aside>
          <main>
            <div>
              <input
                type="search"
                value={searchInput}
                onChange={this.onChangeSearch}
                placeholder="Search"
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onClickSearch}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsConent()}
          </main>
        </div>
      </>
    )
  }
}

export default withRouter(Jobs)
