import React, {Component} from 'react'
import PropTypes from 'prop-types';
import Tasks from '/imports/api/tasks'

export default class Task extends Component {
  toggleChecked() {
    // delete from insecure
    // Tasks.update(this.props.task._id, {
    //   $set: { checked: !this.props.task.checked }
    // })
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked)
  }

  deleteThisTask() {
    // delete from insecure
    // Tasks.remove(this.props.task._id)
    Meteor.call('tasks.remove', this.props.task._id)
  }

  render() {

    const taskClassName = this.props.task.checked ? 'checked' : ''

    return (
      <li className={taskClassName}>
        <button className="delete" onClick={this.deleteThisTask.bind(this)}>
          &times;
        </button>
        <input type="checkbox" readOnly checked={this.props.task.checked} onClick={this.toggleChecked.bind(this)}/>
        <span className="text">
          {this.props.task.text} - <strong>{this.props.task.username}</strong>
        </span>
      </li>
    )
  }

}

Task.propTypes = {
  task: PropTypes.object.isRequired
}
