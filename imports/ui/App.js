import React, {Component} from 'react'
import {createContainer} from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import { Meteor } from 'meteor/meteor'

import Task from '/imports/ui/Task'
import Tasks from '/imports/api/tasks'

import AccountsUIWrapper from '/imports/ui/AccountsUIWrapper'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hideCompleted: false
    }
  }

  toggleCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted
    })
  }

  handleSubmit(event) {
    event.preventDefault()

    const text = this.refs.textInput.value.trim()

    // removed from insecure
    // Tasks.insert({
    //   text,
    //   createdAt: new Date(),
    //   owner: Meteor.userId(),
    //   username: Meteor.user().username
    // })

    Meteor.call('tasks.insert', text)

    this.refs.textInput.value = ''
  }

  getTasks() {
    return [
      { _id: 1, text: 'this is 1' },
      { _id: 2, text: 'this is 2' },
      { _id: 3, text: 'this is 3' },
    ]
  }

  renderTasks() {
    let filteredTasks = this.props.tasks
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked)
    }
    return filteredTasks.map(task => <Task key={task._id} task={task}/>)
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List {this.props.incompletedCount}</h1>
          <label className="hideCompleted">
            <input type="checkbox" readOnly checked={this.state.hideCompleted}
                   onClick={this.toggleCompleted.bind(this)}/>
            Hide Completed Tasks
          </label>
          <AccountsUIWrapper/>
          {
            this.props.currentUser &&
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
              <input type="text" ref="textInput" placeholder="Type a new task"/>
            </form>
          }
        </header>
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    )
  }

}

App.protoTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object
}

export default createContainer(() => {
  Meteor.subscribe('tasks')
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompletedCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user()
  }
}, App)
