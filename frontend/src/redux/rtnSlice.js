// // src/redux/rtnSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const rtnSlice = createSlice({
//   name: 'realTimeNotification',
//   initialState: {
//     likeNotification: [],
//   },
//   reducers: {
//     setLikeNotification: (state, action) => {
//       if (action.payload.type === 'like' || action.payload.type === 'dislike') {
//         const exists = state.likeNotification.some(
//           (notif) => notif._id === action.payload._id
//         );
//         if (!exists) {
//           state.likeNotification.push({ ...action.payload, isRead: false });
//         }
//       } else if (action.payload.type === 'clearCountOnly') {
//         state.likeNotification = state.likeNotification.map((n) => ({
//           ...n,
//           isRead: true,
//         }));
//       } else if (action.payload.type === 'clear') {
//         state.likeNotification = [];
//       }
//     },
//   },
// });

// export const { setLikeNotification } = rtnSlice.actions;
// export default rtnSlice.reducer;








// src/redux/rtnSlice.js
import { createSlice } from '@reduxjs/toolkit';

const rtnSlice = createSlice({
  name: 'realTimeNotification',
  initialState: {
    likeNotification: [],
  },
  reducers: {
    setLikeNotification: (state, action) => {
      if (action.payload.type === 'like' || action.payload.type === 'dislike') {
        const exists = state.likeNotification.some(
          notif => notif._id === action.payload._id
        );
        if (!exists) {
          state.likeNotification.push({ ...action.payload, isRead: false });
        }
      } else if (action.payload.type === 'clearCountOnly') {
        // Mark as read locally
        state.likeNotification = state.likeNotification.map(n => ({
          ...n,
          isRead: true,
        }));
      } else if (action.payload.type === 'clear') {
        state.likeNotification = [];
      }
    },
  },
});

export const { setLikeNotification } = rtnSlice.actions;
export default rtnSlice.reducer;
