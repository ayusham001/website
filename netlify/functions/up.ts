import type { Handler } from '@netlify/functions'
import axios from 'axios'
import { useSupabase } from '../services/supabase'
import { findEnv, getRightKey, sendRes, transformEnvVar } from '../services/utils'
import type { definitions } from '~/types/supabase'

interface Params {
  service: string
}

export const handler: Handler = async(event) => {
  if (event.httpMethod !== 'GET')
    return sendRes({ error: 'invalid httpMethod' }, 500)
  const body = event.queryStringParameters as any as Params
  const supabase = useSupabase(getRightKey(findEnv(event.rawUrl), 'supa_url'), transformEnvVar(findEnv(event.rawUrl), 'SUPABASE_ADMIN_KEY'))
  if (body.service === 'database') {
    const { data, error } = await supabase
      .from<definitions['apps']>('apps')
      .select()
      .eq('app_id', 'unknow.unknow')
      .single()
    if (data && !error)
      return sendRes()
    else
      return sendRes({ error: 'db not answering as expected' }, 500)
  }
  if (body.service === 'api') {
    return axios.post('https://xvwzpoazmxkqosrdewyv.functions.supabase.co/ok')
      .then(() => sendRes())
  }
  return sendRes({ error: 'unknow error' }, 500)
}
