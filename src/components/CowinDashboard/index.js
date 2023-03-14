import {Component} from 'react'

import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    last7daysofVaccination: {},
    vaccinationByAge: {},
    vaccinationByGender: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getCowinDetails()
  }

  getCowinDetails = async () => {
    const response = await fetch('https://apis.ccbp.in/covid-vaccination-data')

    if (response.ok) {
      const fetchedData = await response.json()
      const updatedlast7daysofVaccination = fetchedData.last_7_days_vaccination.map(
        eachItem => ({
          vaccineDate: eachItem.vaccine_date,
          dose1: eachItem.dose_1,
          dose2: eachItem.dose_2,
        }),
      )
      const fetchedVaccinationByAge = fetchedData.vaccination_by_age
      const fetchedVaccinationByGender = fetchedData.vaccination_by_gender
      console.log(fetchedVaccinationByAge)
      this.setState({
        last7daysofVaccination: updatedlast7daysofVaccination,
        vaccinationByAge: fetchedVaccinationByAge,
        vaccinationByGender: fetchedVaccinationByGender,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderVaccinationDetails = () => {
    const {
      last7daysofVaccination,
      vaccinationByAge,
      vaccinationByGender,
    } = this.state
    return (
      <div className="app-container">
        <div className="logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png "
            alt="website logo"
            className="logo"
          />
          <p className="logo-text">Co-win</p>
        </div>
        <h1 className="main-heading">CoWIN Vaccination in India</h1>
        <VaccinationCoverage last7daysofVaccination={last7daysofVaccination} />
        <VaccinationByAge vaccinationByAge={vaccinationByAge} />
        <VaccinationByGender vaccinationByGender={vaccinationByGender} />
      </div>
    )
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1>Something went wrong</h1>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderVaccinationDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.initial:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default CowinDashboard
