import { NextApiRequest, NextApiResponse } from 'next';

// AUTH
import checkUsername from './_logic/auth/check-username';
import login from './_logic/auth/login';
import register from './_logic/auth/register';
import resetPassword from './_logic/auth/reset-password';
import sendPin from './_logic/auth/send-pin';
import verifyPin from './_logic/auth/verify-pin';

// USERS
import usersCreate from './_logic/users/create';
import usersDelete from './_logic/users/delete';
import usersGet from './_logic/users/get';
import usersUpdate from './_logic/users/update';

// TEAMS
import teamsCreate from './_logic/teams/create';
import teamsDelete from './_logic/teams/delete';
import teamsGet from './_logic/teams/get';
import teamsUpdate from './_logic/teams/update';

// EVENTS
import eventsCreate from './_logic/events/create';
import eventsDelete from './_logic/events/delete';
import eventsGet from './_logic/events/get';
import eventsUpdate from './_logic/events/update';

// EVENT CATEGORIES
import catCreate from './_logic/event-categories/create';
import catDelete from './_logic/event-categories/delete';
import catGet from './_logic/event-categories/get';
import catUpdate from './_logic/event-categories/update';

// EVENT REGISTRATIONS
import regCreate from './_logic/event-registrations/create';
import regDelete from './_logic/event-registrations/delete';
import regGet from './_logic/event-registrations/get';

// EVENT REDIRECTS
import redCreate from './_logic/event-redirects/create';
import redGet from './_logic/event-redirects/get';

// CREATOR REQUESTS
import creCreate from './_logic/creator-requests/create';
import creDelete from './_logic/creator-requests/delete';
import creGet from './_logic/creator-requests/get';
import creUpdate from './_logic/creator-requests/update';

// FAVORITES
import favGet from './_logic/favorites/get';
import favToggle from './_logic/favorites/toggle';

// FOLLOWS
import folGet from './_logic/follows/get';
import folToggle from './_logic/follows/toggle';

// SUPERVISOR GUESTS
import sugCreate from './_logic/supervisor-guests/create';
import sugDelete from './_logic/supervisor-guests/delete';
import sugGet from './_logic/supervisor-guests/get';

const routes: any = {
    'auth': { 
        'check-username': checkUsername, 'login': login, 'register': register, 
        'reset-password': resetPassword, 'send-pin': sendPin, 'verify-pin': verifyPin 
    },
    'users': { 'create': usersCreate, 'delete': usersDelete, 'get': usersGet, 'update': usersUpdate },
    'teams': { 'create': teamsCreate, 'delete': teamsDelete, 'get': teamsGet, 'update': teamsUpdate },
    'events': { 'create': eventsCreate, 'delete': eventsDelete, 'get': eventsGet, 'update': eventsUpdate },
    'event-categories': { 'create': catCreate, 'delete': catDelete, 'get': catGet, 'update': catUpdate },
    'event-registrations': { 'create': regCreate, 'delete': regDelete, 'get': regGet },
    'event-redirects': { 'create': redCreate, 'get': redGet },
    'creator-requests': { 'create': creCreate, 'delete': creDelete, 'get': creGet, 'update': creUpdate },
    'favorites': { 'get': favGet, 'toggle': favToggle },
    'follows': { 'get': folGet, 'toggle': folToggle },
    'supervisor-guests': { 'create': sugCreate, 'delete': sugDelete, 'get': sugGet }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { category, action } = req.query;

    if (category === 'ping') {
        return res.status(200).json({ success: true, message: 'API Master is working' });
    }

    if (!category || !action || typeof category !== 'string' || typeof action !== 'string') {
        return res.status(404).json({ success: false, message: 'Invalid API path' });
    }

    const categoryHandlers = routes[category];
    if (!categoryHandlers) {
        return res.status(404).json({ success: false, message: `Category ${category} not found` });
    }

    const actionHandler = categoryHandlers[action];
    if (!actionHandler) {
        return res.status(404).json({ success: false, message: `Action ${action} in ${category} not found` });
    }

    try {
        return await actionHandler(req, res);
    } catch (err: any) {
        console.error(`API Error (${category}/${action}):`, err);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error', 
            category, 
            action, 
            error: err.message 
        });
    }
}
