import { MongoClient } from "mongodb"

// Make MongoDB connection optional during build
const MONGODB_URI = process.env.MONGODB_URI

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!MONGODB_URI) {
  console.warn(
    "MongoDB URI not found. Please set MONGODB_URI environment variable. Using a mock client for build process.",
  )

  // Create a mock client for build process
  client = {
    connect: () => Promise.resolve({} as MongoClient),
    db: () => ({
      collection: () => ({
        find: () => ({ toArray: () => Promise.resolve([]) }),
        findOne: () => Promise.resolve(null),
        insertOne: () => Promise.resolve({ insertedId: "mock-id" }),
        updateOne: () => Promise.resolve({ matchedCount: 0 }),
      }),
      listCollections: () => ({ toArray: () => Promise.resolve([]) }),
      createCollection: () => Promise.resolve({}),
      stats: () => Promise.resolve({}),
    }),
  } as unknown as MongoClient

  clientPromise = Promise.resolve(client)
} else {
  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof global & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(MONGODB_URI, options)
      globalWithMongo._mongoClientPromise = client.connect()
      console.log("MongoDB connection initialized in development mode")
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(MONGODB_URI, options)
    clientPromise = client.connect()
    console.log("MongoDB connection initialized in production mode")
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
