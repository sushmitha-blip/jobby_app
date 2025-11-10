import './index.css'

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const FiltersGroup = props => {
  const {
    employmentType,
    salaryRange,
    onChangeEmploymentType,
    onChangeSalaryRange,
  } = props

  const renderEmploymentTypes = () => (
    <div>
      <h1>Type of Employment</h1>
      <ul>
        {employmentTypesList.map(eachType => {
          const onChange = () =>
            onChangeEmploymentType(eachType.employmentTypeId)
          const isChecked = employmentType.includes(eachType.employmentTypeId)

          return (
            <li key={eachType.employmentTypeId}>
              <input
                type="checkbox"
                id={eachType.employmentTypeId}
                onChange={onChange}
                checked={isChecked}
              />
              <label htmlFor={eachType.employmentTypeId}>
                {eachType.label}
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )

  const renderSalaryRanges = () => (
    <div>
      <h1>Salary Range</h1>
      <ul>
        {salaryRangesList.map(range => {
          const onChange = () => onChangeSalaryRange(range.salaryRangeId)
          const isChecked = salaryRange === range.salaryRangeId
          return (
            <li key={range.salaryRangeId}>
              <input
                type="radio"
                name="salary"
                id={range.salaryRangeId}
                onChange={onChange}
                checked={isChecked}
              />
              <label htmlFor={range.salaryRangeId}>{range.label}</label>
            </li>
          )
        })}
      </ul>
    </div>
  )

  return (
    <div>
      {renderEmploymentTypes()}
      <hr />
      {renderSalaryRanges()}
    </div>
  )
}

export default FiltersGroup
