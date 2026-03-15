import { NextApiRequest, NextApiResponse } from 'next';

// EXPLICIT IMPORTS FOR BUNDLING RELIABILITY
import auth_check_username from './_logic/auth/check-username';
import auth_login from './_logic/auth/login';
import auth_register from './_logic/auth/register';
import auth_reset_password from './_logic/auth/reset-password';
import auth_send_pin from './_logic/auth/send-pin';
import auth_verify_pin from './_logic/auth/verify-pin';

import cre_create from './_logic/creator-requests/create';
import cre_delete from './_logic/creator-requests/delete';
import cre_get from './_logic/creator-requests/get';
import cre_update from './_logic/creator-requests/update';

import cat_create from './_logic/event-categories/create';
import cat_delete from './_logic/event-categories/delete';
import cat_get from './_logic/event-categories/get';
import cat_update from './_logic/event-categories/update';

import red_create from './_logic/event-redirects/create';
import red_get from './_logic/event-redirects/get';

import reg_create from './_logic/event-registrations/create';
import reg_delete from './_logic/event-registrations/delete';
import reg_get from './_logic/event-registrations/get';

import events_create from './_logic/events/create';
import events_delete from './_logic/events/delete';
import events_get from './_logic/events/get';
import events_update from './_logic/events/update';

import fav_get from './_logic/favorites/get';
import fav_toggle from './_logic/favorites/toggle';

import fol_get from './_logic/follows/get';
import fol_toggle from './_logic/follows/toggle';

import sug_create from './_logic/supervisor-guests/create';
import sug_delete from './_logic/supervisor-guests/delete';
import sug_get from './_logic/supervisor-guests/get';

import teams_create from './_logic/teams/create';
import teams_delete from './_logic/teams/delete';
import teams_get from './_logic/teams/get';
import teams_update from './_logic/teams/update';

import users_create from './_logic/users/create';
import users_delete from './_logic/users/delete';
import users_get from './_logic/users/get';
import users_update from './_logic/users/update';

const routes: Record<string, Record<string, any>> = {
    'auth': { 
        'check-username': auth_check_username, 'login': auth_login, 'register': auth_register, 
        'reset-password': auth_reset_password, 'send-pin': auth_send_pin, 'verify-pin': auth_verify_pin 
    },
    'creator-requests': { 'create': cre_create, 'delete': cre_delete, 'get': cre_get, 'update': cre_update },
    'event-categories': { 'create': cat_create, 'delete': cat_delete, 'get': cat_get, 'update': cat_update },
    'event-redirects': { 'create': red_create, 'get': red_get },
    'event-registrations': { 'create': reg_create, 'delete': reg_delete, 'get': reg_get },
    'events': { 'create': events_create, 'delete': events_delete, 'get': events_get, 'update': events_update },
    'favorites': { 'get': fav_get, 'toggle': fav_toggle },
    'follows': { 'get': fol_get, 'toggle': fol_toggle },
    'supervisor-guests': { 'create': sug_create, 'delete': sug_delete, 'get': sug_get },
    'teams': { 'create': teams_create, 'delete': teams_delete, 'get': teams_get, 'update': teams_update },
    'users': { 'create': users_create, 'delete': users_delete, 'get': users_get, 'update': users_update }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { category, action } = req.query;

    if (category === 'ping') {
        return res.status(200).json({ success: true, message: 'API Master v2 (Explicit) is stable' });
    }

    if (!category || !action || typeof category !== 'string' || typeof action !== 'string') {
        return res.status(404).json({ success: false, message: 'Invalid API path format' });
    }

    const categoryHandlers = routes[category];
    if (!categoryHandlers) {
        return res.status(404).json({ success: false, message: `Category '${category}' not found` });
    }

    const actionHandler = categoryHandlers[action];
    if (!actionHandler) {
        return res.status(404).json({ success: false, message: `Action '${action}' in '${category}' not found` });
    }

    try {
        // Since we explicitly imported, we can just call it
        return await actionHandler(req, res);
    } catch (err: any) {
        console.error(`Runtime API Error (${category}/${action}):`, err);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error in logic',
            path: `${category}/${action}`,
            error: err.message
        });
    }
}
