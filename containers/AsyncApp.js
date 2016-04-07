import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectTopic, fetchPostsIfNeeded, invalidateTopic } from '../redux/actions'
import Picker from '../components/Picker'
import Posts from '../components/Posts'

class AsyncApp extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.handleRefreshClick = this.handleRefreshClick.bind(this)
    }
    
    componentDidMount() {
        const { dispatch, selectedTopic } = this.props
        dispatch(fetchPostsIfNeeded(selectedTopic))
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedTopic !== this.props.selectedTopic) {
        const { dispatch, selectedTopic } = nextProps
        dispatch(fetchPostsIfNeeded(selectedTopic))
        }
    }
    
    handleChange(nextTopic) {
        this.props.dispatch(selectTopic(nextTopic))
    }
    
    handleRefreshClick(e) {
        e.preventDefault()
    
        const { dispatch, selectedTopic } = this.props
        dispatch(invalidateTopic(selectedTopic))
        dispatch(fetchPostsIfNeeded(selectedTopic))
    }
    
    render () {
        const { selectedTopic, posts, isFetching, lastUpdated } = this.props

        return (
        <div style={{margin:'20px'}}>
            <Picker value={selectedTopic} onChange={this.handleChange} options={[ 'all', 'good', 'share', 'ask' ]} />
            
            <p>
            {lastUpdated &&
                <span>
                    Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
                    {' '}
                </span>
            }
            {!isFetching &&
                <a href='#' onClick={this.handleRefreshClick}>
                    Refresh
                </a>
            }
            </p>
            {isFetching && posts.length === 0 &&
            <h2>Loading...</h2>
            }
            {!isFetching && posts.length === 0 &&
            <h2>Empty.</h2>
            }
            {posts.length > 0 &&
            <Posts posts={posts} />
            }
        </div>
        )
    }
}


AsyncApp.propTypes = {
    selectedTopic: PropTypes.string.isRequired,
    posts: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    const { selectedTopic, postsByTopic } = state
    const { isFetching, lastUpdated, items: posts } = postsByTopic[selectedTopic] || {
        isFetching: true,
        items: []
    }
    
    return {
        selectedTopic,
        posts,
        isFetching,
        lastUpdated
    }
}

export default connect(mapStateToProps)(AsyncApp)