import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, NavLink } from 'react-router-dom';
import { signUp } from '../../store/session';

import { defaultImg } from '../../store/utils/image_urls';

import './dragDrop.css'

const SignUpForm = () => {
  const theme = 'light';

  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [imageFile, setImageFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const addFileRef = useRef(null);

  const dragOverHandler = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const dragEnterHandler = (e) => {
    e.preventDefault()
    if (e.target.id == 'drag-container') {
      setDragging(true);
    }
  }
  const dragLeaveHandler = (e) => {
    e.preventDefault()
    if (e.target.id == 'drag-container' && e.relatedTarget.id != 'drag-border') {
      setDragging(false);
    }
  }
  const dropHandler = (e) => {
    e.preventDefault()
    if (e.dataTransfer.items && e.dataTransfer.items[0]) {
      setImageFile(e.dataTransfer.items[0].getAsFile())
    }
    setDragging(false);
  }

  // const [preview, setPreview] = useState('');
  // const [previewError, setPreviewError] = useState(false);

  // function refreshPreview(e) {
  //   setPreview(profilePicture);
  //   setPreviewError(false);
  // }

  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      const data = await dispatch(signUp(username, email, password, profilePicture));
      if (data) {
        setErrors(data)
      }
    } else {
      setErrors(['Passwords do not match'])
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updateProfilePicture = (e) => {
    setProfilePicture(e.target.value)
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <form onSubmit={onSignUp} className='auth-form'>
        <div className='errors-container'>
          {errors.map((error, ind) => (
            <div className='errors-container' key={ind}>{error}</div>
          ))}
        </div>
        <div>
          <label className='required'>Username</label>
          <input
            type='text'
            name='username'
            placeholder='Required'
            onChange={updateUsername}
            value={username}
          ></input>
        </div>
        <div>
          <label className='required'>Email</label>
          <input
            type='text'
            name='email'
            placeholder='your_email@domain.com'
            onChange={updateEmail}
            value={email}
          ></input>
        </div>
        {/* <div>
          <label>Profile Picture <span id='preview-image-clicker' onClick={refreshPreview}>(preview)</span></label>
          <input
            type='text'
            name='ProfilePicture'
            placeholder='https:// ... { .jpg, .jpeg, .png, .gif, .tiff }'
            onChange={updateProfilePicture}
            value={profilePicture}
          ></input>
        </div> */}
        <div>
          <label className='required'>Password</label>
          <input
            type='password'
            name='password'
            placeholder='at least 6 characters'
            onChange={updatePassword}
            value={password}
          ></input>
        </div>
        <div>
          <label className='required'>Repeat Password</label>
          <input
            type='password'
            name='repeat_password'
            placeholder='at least 6 characters'
            onChange={updateRepeatPassword}
            value={repeatPassword}
            required={true}
          ></input>
        </div>
        <button className={'submit-button ' + theme} type='submit'>Create an Account</button>
        <div className={'sep ' + theme}><span>or</span></div>
        <NavLink to='/login'>I already have an account</NavLink>
      </form>
      {/* <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 15 }}>
        {previewError ? <>
          <span>Default image:</span>
          <img src={defaultImg} className='preview-image' />
        </>
          : <>
            <span>Preview of image:</span>
            <img src={preview} onError={() => setPreviewError(true)} className='preview-image' />
          </>
        }
      </div> */}
      <div id='drag-container'
        // onDragEnter={dragEnterHandler}
        onDragLeave={dragLeaveHandler}
        onDragOver={dragOverHandler}
        onDrop={dropHandler}
        onClick={(e) => {
          // e.preventDefault()
          addFileRef.current.click()
        }}
        className={dragging ? 'dragging' : ''}
      >
        <div id='drag-border' className={imageFile ? 'has-file' : 'hasnt-file'} onDrop={dropHandler}>
          {!imageFile ? <span>Drag Files Here</span> :
            <>
              <i className='fas fa-check-circle' />
              <p>{imageFile.name}</p>
            </>}
        </div>
        <input
          ref={addFileRef}
          type='file'
          id='hidden-file-input'
          onChange={(e) => {
            setImageFile(e.target.files[0])
          }}
        />
      </div>
    </div>
  );
};

export default SignUpForm;
