import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';
import axios from 'axios';

export const useUserStore = defineStore('user', () => {
    const state = reactive({
        userInfo: null,
        isLoggedIn: false,
        accessToken: null,
        team_id: null,
        teams: [],
    });

    const setUser = (user) => {
        state.userInfo = user;
        state.isLoggedIn = true;
    }

    const clearUser = () => {
        state.userInfo = null;
        state.isLoggedIn = false;
        state.accessToken = null;
    }

    const setToken = (accessToken) => {
        if(accessToken !== undefined){
            state.accessToken = accessToken;
            axios.defaults.headers.common['authorization'] = accessToken;
        }
    }

    const updateUser = (user) => {
        state.userInfo = user;
    }

    const updateTeam = (updatedTeam) => {
        const index = state.teams.findIndex(team => team.id === updatedTeam.id);
        if (index !== -1) {
            state.teams.splice(index, 1, updatedTeam); 
        } else {
            state.teams.push(updatedTeam); 
        }
    };
    const leaveTeam = (teamId) => {
        state.teams = state.teams.filter(team => team.id !== teamId); 
    };

    // team_id 설정 (Setter)
    const setTeamId = (teamId) => {
        state.team_id = teamId;
    };

    // team_id 조회 (Getter)
    const teamId = computed(() => state.team_id);

    const userInfo = computed(() => state.userInfo);
    const isLoggedIn = computed(() => state.isLoggedIn);
    const accessToken = computed(() => state.accessToken);

    return { 
        state,
        setUser,
        clearUser, 
        setToken,
        updateUser,
        setTeamId,
        teamId,
        userInfo,
        isLoggedIn,
        accessToken,
        updateTeam,
        leaveTeam,
    };
},
{
    persist: true
});