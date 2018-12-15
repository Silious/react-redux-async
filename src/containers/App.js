import React, { Component } from 'react';
import PropsTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectSubreddit, fetchPostsIfNeeded, invalidateSubreddit } from '../actions';
import Picker from '../components/Picker';
import Posts from '../components/Posts';

class App extends Component {
    static propsTypes = {
        selectSubreddit: PropsTypes.string.isRequired,
        posts: PropsTypes.array.isRequired,
        isFetching: PropsTypes.bool.invalidateSubreddit,
        lastUpdated: PropsTypes.number,
        dispatch: PropsTypes.func.isRequired
    }

    componentDidMount() {
        const { dispatch, selectSubreddit } = this.props;
        dispatch(fetchPostsIfNeeded(selectSubreddit));
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectSubreddit !== this.props.selectSubreddit) {
            const { dispatch, selectSubreddit } = this.props;
            dispatch(fetchPostsIfNeeded(selectSubreddit));
        }
    }

    handleChange = nextSubreddit => {
        this.props.dispatch(selectSubreddit(nextSubreddit));
    }

    handleRefreshClick = e => {
        e.preventDefault();
        const { dispatch, selectSubreddit } = this.props;
        dispatch(invalidateSubreddit(selectSubreddit));
        dispatch(fetchPostsIfNeeded(selectSubreddit));
    }

    render() {
        const { selectedSubreddit, posts, isFetching, lastUpdated } = this.props;
        const isEmpty = posts.length === 0;

        return (
            <div>
                <Picker value={selectedSubreddit}
                    onChange={this.handleChange}
                    options={['reactjs', 'frontend']}
                />
                <p>
                    {lastUpdated &&
                        <span>
                            Last Update at {new Date(lastUpdated).toLocaleTimeString()}.
                        {' '}
                        </span>
                    }
                    {!isFetching && <button onClick={this.handleRefreshClick}>Refresh</button>}
                </p>
                {
                    isEmpty ? (isFetching ? <h2>Loading</h2> : <h2>Empty.</h2>) :
                        <div style={{ opacity: isFetching ? 0.5 : 1 }}>
                            <Posts posts={posts} />
                        </div>
                }
            </div>
        )
    }
}

const mapStatetoProps = state => {
    const { selectedSubreddit, postsBySubreddit } = state;
    const {
        isFetching, lastUpdated, items: posts
    } = postsBySubreddit[selectedSubreddit] || {
        isFetching: true,
        items: []
    }

    return {
        selectedSubreddit,
        posts,
        isFetching,
        lastUpdated
    }
}

export default connect(mapStatetoProps)(App);