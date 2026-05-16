definePlugin('@plugins/com.msgbyte.livekit/useRoomParticipants-733f51b1.js', ['exports', '@capital/common', 'react'], (function (exports, common, React) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	const request = common.createPluginRequest("com.msgbyte.livekit");

	function useRoomParticipants(roomName) {
	  const [{ value: participants = [], loading }, _handleFetchParticipants] = common.useAsyncFn(async () => {
	    const { data } = await request.post("roomMembers", {
	      roomName
	    });
	    return data != null ? data : [];
	  }, [roomName]);
	  const fetchParticipants = common.useEvent(_handleFetchParticipants);
	  const lockRef = React.useRef(false);
	  const isFirstLoading = React.useMemo(() => {
	    if (loading && lockRef.current === false) {
	      lockRef.current = true;
	      return true;
	    }
	    return false;
	  }, [loading]);
	  return {
	    loading,
	    isFirstLoading,
	    participants,
	    fetchParticipants
	  };
	}

	exports.commonjsGlobal = commonjsGlobal;
	exports.request = request;
	exports.useRoomParticipants = useRoomParticipants;

}));
//# sourceMappingURL=useRoomParticipants-733f51b1.js.map
