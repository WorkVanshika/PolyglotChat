/* This function returns aggregate query pipeline which will at the end result into 
returning us the active users of specific room along with their preferred language. 
 */
export function getQueryPipelineToFetchActiveRoomUsers(roomName: string) {
  return [
    {
      $match: {
        name: roomName,
      },
    },
    {
      $unwind: {
        path: "$members",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "members.email",
        foreignField: "email",
        as: "userDetails",
      },
    },
    {
      $unwind: {
        path: "$userDetails",
      },
    },
    {
      $project: {
        _id: 0,
        preferredLanguage: "$userDetails.preferredLanguage",
        socketId: "$members.socketId",
      },
    },
  ];
}

// the output of above query would be array of below mentioned interface
export interface userSocketIdLanguageResponse {
  preferredLanguage: string;
  socketId: string;
}
