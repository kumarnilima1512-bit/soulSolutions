export const notionHeaders = () => {
  const config = useRuntimeConfig()
  return {
    Authorization: `Bearer ${config.notionToken}`,
    'Notion-Version': '2025-09-03',
    'Content-Type': 'application/json',
  }
}

//  fetching datasource id from query database 
export const getDataSourceId = async (databaseId: string): Promise<string> => {
  const db = await $fetch<{ data_sources?: { id: string }[] }>(
    `https://api.notion.com/v1/databases/${databaseId}`,
    { headers: notionHeaders() },
  )
  const id = db.data_sources?.[0]?.id
  if (!id) throw new Error('No data source found on this database')
  return id
}