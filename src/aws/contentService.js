import { dynamoDB } from './dynamodbConfig';

const PROJECTS_TABLE = 'portfolio-projects';
const CERTIFICATIONS_TABLE = 'portfolio-certifications';
const BLOGS_TABLE = 'portfolio-blogs';

// ==================== PROJECTS ====================

/**
 * Get all projects
 */
export const getProjects = async () => {
    try {
        const params = {
            TableName: PROJECTS_TABLE
        };
        const result = await dynamoDB.scan(params).promise();
        return result.Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

/**
 * Add a new project
 */
export const addProject = async (projectData) => {
    try {
        const timestamp = new Date().toISOString();
        const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const item = {
            id: projectId,
            ...projectData,
            createdAt: timestamp,
            updatedAt: timestamp
        };

        const params = {
            TableName: PROJECTS_TABLE,
            Item: item
        };

        await dynamoDB.put(params).promise();
        return { success: true, projectId };
    } catch (error) {
        console.error('Error adding project:', error);
        throw error;
    }
};

/**
 * Update a project
 */
export const updateProject = async (projectId, projectData) => {
    try {
        const updateExpressions = [];
        const expressionAttributeValues = {};
        const expressionAttributeNames = {};

        Object.keys(projectData).forEach((key, index) => {
            const attrName = `#attr${index}`;
            const attrValue = `:val${index}`;
            updateExpressions.push(`${attrName} = ${attrValue}`);
            expressionAttributeNames[attrName] = key;
            expressionAttributeValues[attrValue] = projectData[key];
        });

        expressionAttributeValues[':updatedAt'] = new Date().toISOString();
        updateExpressions.push('#updatedAt = :updatedAt');
        expressionAttributeNames['#updatedAt'] = 'updatedAt';

        const params = {
            TableName: PROJECTS_TABLE,
            Key: { id: projectId },
            UpdateExpression: `SET ${updateExpressions.join(', ')}`,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames
        };

        await dynamoDB.update(params).promise();
        return { success: true };
    } catch (error) {
        console.error('Error updating project:', error);
        throw error;
    }
};

/**
 * Delete a project
 */
export const deleteProject = async (projectId) => {
    try {
        const params = {
            TableName: PROJECTS_TABLE,
            Key: { id: projectId }
        };
        await dynamoDB.delete(params).promise();
        return { success: true };
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
};

// ==================== CERTIFICATIONS ====================

/**
 * Get all certifications
 */
export const getCertifications = async () => {
    try {
        const params = {
            TableName: CERTIFICATIONS_TABLE
        };
        const result = await dynamoDB.scan(params).promise();
        return result.Items.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
        console.error('Error fetching certifications:', error);
        throw error;
    }
};

/**
 * Add a new certification
 */
export const addCertification = async (certData) => {
    try {
        const timestamp = new Date().toISOString();
        const certId = `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const item = {
            id: certId,
            ...certData,
            createdAt: timestamp,
            updatedAt: timestamp
        };

        const params = {
            TableName: CERTIFICATIONS_TABLE,
            Item: item
        };

        await dynamoDB.put(params).promise();
        return { success: true, certId };
    } catch (error) {
        console.error('Error adding certification:', error);
        throw error;
    }
};

/**
 * Update a certification
 */
export const updateCertification = async (certId, certData) => {
    try {
        const updateExpressions = [];
        const expressionAttributeValues = {};
        const expressionAttributeNames = {};

        Object.keys(certData).forEach((key, index) => {
            const attrName = `#attr${index}`;
            const attrValue = `:val${index}`;
            updateExpressions.push(`${attrName} = ${attrValue}`);
            expressionAttributeNames[attrName] = key;
            expressionAttributeValues[attrValue] = certData[key];
        });

        expressionAttributeValues[':updatedAt'] = new Date().toISOString();
        updateExpressions.push('#updatedAt = :updatedAt');
        expressionAttributeNames['#updatedAt'] = 'updatedAt';

        const params = {
            TableName: CERTIFICATIONS_TABLE,
            Key: { id: certId },
            UpdateExpression: `SET ${updateExpressions.join(', ')}`,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames
        };

        await dynamoDB.update(params).promise();
        return { success: true };
    } catch (error) {
        console.error('Error updating certification:', error);
        throw error;
    }
};

/**
 * Delete a certification
 */
export const deleteCertification = async (certId) => {
    try {
        const params = {
            TableName: CERTIFICATIONS_TABLE,
            Key: { id: certId }
        };
        await dynamoDB.delete(params).promise();
        return { success: true };
    } catch (error) {
        console.error('Error deleting certification:', error);
        throw error;
    }
};

// ==================== BLOGS ====================

/**
 * Get all blogs
 */
export const getBlogs = async () => {
    try {
        const params = {
            TableName: BLOGS_TABLE
        };
        const result = await dynamoDB.scan(params).promise();
        return result.Items.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
        console.error('Error fetching blogs:', error);
        throw error;
    }
};

/**
 * Add a new blog
 */
export const addBlog = async (blogData) => {
    try {
        const timestamp = new Date().toISOString();
        const blogId = `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const item = {
            id: blogId,
            ...blogData,
            createdAt: timestamp,
            updatedAt: timestamp
        };

        const params = {
            TableName: BLOGS_TABLE,
            Item: item
        };

        await dynamoDB.put(params).promise();
        return { success: true, blogId };
    } catch (error) {
        console.error('Error adding blog:', error);
        throw error;
    }
};

/**
 * Update a blog
 */
export const updateBlog = async (blogId, blogData) => {
    try {
        const updateExpressions = [];
        const expressionAttributeValues = {};
        const expressionAttributeNames = {};

        Object.keys(blogData).forEach((key, index) => {
            const attrName = `#attr${index}`;
            const attrValue = `:val${index}`;
            updateExpressions.push(`${attrName} = ${attrValue}`);
            expressionAttributeNames[attrName] = key;
            expressionAttributeValues[attrValue] = blogData[key];
        });

        expressionAttributeValues[':updatedAt'] = new Date().toISOString();
        updateExpressions.push('#updatedAt = :updatedAt');
        expressionAttributeNames['#updatedAt'] = 'updatedAt';

        const params = {
            TableName: BLOGS_TABLE,
            Key: { id: blogId },
            UpdateExpression: `SET ${updateExpressions.join(', ')}`,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames
        };

        await dynamoDB.update(params).promise();
        return { success: true };
    } catch (error) {
        console.error('Error updating blog:', error);
        throw error;
    }
};

/**
 * Delete a blog
 */
export const deleteBlog = async (blogId) => {
    try {
        const params = {
            TableName: BLOGS_TABLE,
            Key: { id: blogId }
        };
        await dynamoDB.delete(params).promise();
        return { success: true };
    } catch (error) {
        console.error('Error deleting blog:', error);
        throw error;
    }
};
