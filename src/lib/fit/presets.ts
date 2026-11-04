// Sample job descriptions for recruiters who don't have one to paste.
// Written to read like typical Manila postings for each role; not copied from
// any real company's listing.

export interface FitPreset {
  id: string;
  label: string;
  role: string;
  text: string;
}

export const presets: FitPreset[] = [
  {
    id: "qa",
    label: "QA Analyst",
    role: "Junior QA Analyst role",
    text: `Junior QA Analyst

What you'll do:
- Write and execute test cases for web applications; perform manual, exploratory and regression testing
- Log clear bug reports and track defects to closure in Jira
- Build and maintain automated tests (Selenium, Cypress or Playwright)
- Validate data in SQL databases and test REST APIs
- Work in an Agile/Scrum team and keep test documentation up to date

What we're looking for:
- Bachelor's degree in Computer Science, IT or a related field
- Strong attention to detail and analytical skills
- Familiarity with Git and CI/CD pipelines
- Good communication skills in English`,
  },
  {
    id: "data",
    label: "Data Analyst",
    role: "Data Analyst role",
    text: `Data Analyst

Responsibilities:
- Collect, clean and analyze data from multiple sources; maintain ETL processes
- Build dashboards and data visualization in Power BI or Tableau
- Write SQL queries against relational databases
- Use Excel and Python (pandas) for ad-hoc analysis
- Ensure data quality and data integrity; support audits and compliance reporting
- Present findings to stakeholders

Qualifications:
- Bachelor's degree in Computer Science, Statistics or a related field
- Knowledge of statistics
- Experience working with SLAs and KPIs in a fast-paced environment
- Experience with HRIS data (e.g. Workday) is a plus`,
  },
  {
    id: "ai",
    label: "AI / ML Junior",
    role: "Junior AI/ML Engineer role",
    text: `Junior AI / ML Engineer

You will:
- Prototype machine learning and NLP features in Python
- Build LLM-powered tools using prompt engineering and generative AI APIs
- Evaluate models for accuracy and model fairness; support explainable AI work
- Use TensorFlow or PyTorch for computer vision experiments
- Deploy to the cloud (AWS or GCP) with Docker
- Write unit tests and documentation; collaborate through Git

You have:
- Bachelor's degree in Computer Science or a related field
- Research experience (thesis or publications)
- Strong problem-solving and communication skills`,
  },
];
