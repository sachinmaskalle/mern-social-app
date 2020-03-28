import React from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import PropTypes from 'prop-types';

import { deleteComment} from '../../actions/posts';

const CommentItem = ({ auth, deleteComment, postId, comment: { _id, text, name, avatar, user, date}}) => {
    return (
        <div class="post bg-white p-1 my-1">
          <div>
            <Link to={`/profile/${user}`}>
              <img
                class="round-img"
                src={avatar}
                alt="Avatar"
              />
              <h4>{name}</h4>
            </Link>
          </div>
          <div>
            <p class="my-1">
              {text}
            </p>
             <p class="post-date">
                Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
            </p>
            {
                !auth.loading && user === auth.user._id && (

                    <button type="button" className="btn btn-danger" onClick={e => deleteComment(postId, _id)}>
                        <i className="fas fa-times"></i>
                    </button>
                )
            }
          </div>
          </div>
    )
}

CommentItem.propTypes = {
    postId: PropTypes.string.isRequired,
    auth: PropTypes.object.isRequired,
    comment: PropTypes.object.isRequired,
    deleteComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {deleteComment})(CommentItem);
