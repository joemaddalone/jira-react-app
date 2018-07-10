import React from 'react';
import Iframe from './Iframe';
import './App.css';
class App extends React.Component {
  ticketField = React.createRef();
  state = {
    loggedIn: null,
    postMessageData: null,
    search: null
  };
  handleReceiveMessage = e => {
    const { data = null } = e;
    if (data) {
      const { type, value, error } = data;
      switch (type) {
        case 'ticketDetails':
          console.log(value);
          break;
        case 'jql':
          if (value && !error) {
            this.setState({ jqlResults: JSON.parse(value) });
          }
          else {
            console.log(error);
          }
          break;
        case 'logCheck':
          this.setState({ loggedIn: value });
          break;
        default:
          console.log('unknown', type);
          break;
      }
    }
  }
  ticketSearch = (e) => {
    e.preventDefault();
    this.setState({
      postMessageData: {
        type: 'getTicketDetails',
        value: this.ticketField.current.value
      }
    });
  }
  jql = () => {
    const value = {
      "jql": "project = TESTA AND key in (TESTA-1,TESTA-2,TESTA-3,TESTA-5)",
      "maxResults": 100,
      "fields": [
        "id",
        "key",
        "summary",
        "issuetype",
        "assignee",
        "status",
        "description"
      ],
      "validateQuery": false,
      "expand": [
        "renderedFields"
      ]
    }
    this.setState({ postMessageData: { type: 'jql', value } });
  };
  /**
   * 
   */
  render() {
    return (
      <div>
        <Iframe postMessageData={this.state.postMessageData} handleReceiveMessage={this.handleReceiveMessage} />
        {
          this.state.loggedIn === null
            ? <p>Loading...</p>
            : this.state.loggedIn === false
              ? <a href={`http://localhost:8080/plugins/servlet/devoptics/do-login?devOpticsReturnUrl=${encodeURI(window.location)}`}>Login to JIRA</a>
              : (
                <div>
                  <p>You is logged in!</p>
                  <input placeholder="ticket id" type="text" ref={this.ticketField} />
                  <button onClick={this.ticketSearch}>Search for ticket</button>
                  <button onClick={this.jql}>JQL</button>
                  <hr />
                  <div style={{ margin: 25 }}>
                    {this.state.jqlResults && this.state.jqlResults.issues.map(i => (
                      <TicketWithJira ticket={{ status: 'SUCCESS' }} jiraTicket={i} key={i.key} />
                    ))}
                  </div>
                </div>
              )
        }
      </div>
    );
  }
}


const TicketWithJira = ({ ticket, jiraTicket }) => {
  const { issuetype, summary, status } = jiraTicket.fields;
  return (
    <div className={`Ticket ${ticket.status.toLowerCase()}`}>
      <div className="jira-avatar no-assignee" />
      <div className="ticket-summary">{jiraTicket.key} - {summary}</div>
      <div className="ticket-state">
        <div className="ticket-status">
          <div className="icon-text">{ticket.status.toUpperCase()}</div>
        </div>
        <div className="ticket-info">
          <div className="ticket-type">
            <img src={issuetype.iconUrl} alt="fdsfds" />
          </div>
          <div className="ticket-id">123123</div>
        </div>
        <div className="jira-status">{status.name}</div>
      </div>
    </div>
  );
};

export default App;
