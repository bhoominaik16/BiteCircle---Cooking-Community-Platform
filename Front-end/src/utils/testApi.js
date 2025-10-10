// Front-end/src/utils/testApi.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

/**
 * Test the AI Recipe suggestion API to diagnose issues
 * @param {string} query - Recipe search query
 */
export const testAIRecipeAPI = async (query) => {
    console.log('🧪 Testing AI Recipe API connection...');
    
    try {
        // Test if server is responding
        console.log('Testing server connectivity...');
        
        const serverTest = await axios.get(`${API_BASE_URL}/api/recipes`, { 
            timeout: 5000 
        }).catch(err => {
            throw new Error(`Server connectivity test failed: ${err.message}`);
        });
        
        console.log('✅ Server is online!', serverTest.status);
        
        // Now test the AI recipe endpoint specifically
        console.log('Testing AI recipe endpoint with query:', query);
        
        const testQuery = query || 'pasta with tomatoes';
        const aiTest = await axios.post(`${API_BASE_URL}/api/recipes/ai-suggest`, { 
            query: testQuery, 
            ingredients: ['tomatoes', 'pasta'],
            dietaryPreferences: []
        }, { 
            timeout: 10000 
        });
        
        console.log('✅ AI Recipe API response received!', {
            status: aiTest.status,
            hasData: !!aiTest.data,
            dataSize: JSON.stringify(aiTest.data).length,
            candidates: aiTest.data.candidates ? aiTest.data.candidates.length : 0
        });
        
        // Check if we have a valid Gemini response
        if (aiTest.data.candidates && aiTest.data.candidates[0]?.content?.parts) {
            const text = aiTest.data.candidates[0].content.parts[0].text;
            console.log('AI response text sample:', text.substring(0, 200) + '...');
            
            // Check if we can find JSON in the response
            const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/) || 
                             text.match(/```json\s*([\s\S]*?)\s*```/);
                             
            if (jsonMatch) {
                console.log('✅ Found JSON pattern in response!');
            } else {
                console.log('⚠️ No JSON pattern detected in response');
            }
            
            return {
                success: true,
                message: 'API test completed successfully',
                data: aiTest.data
            };
        } else {
            console.warn('⚠️ Invalid AI response structure:', aiTest.data);
            return {
                success: false,
                message: 'API response has invalid structure',
                data: aiTest.data
            };
        }
    } catch (error) {
        console.error('❌ API test failed:', error);
        return {
            success: false,
            message: `API test failed: ${error.message}`,
            error
        };
    }
};

/**
 * Test the Unsplash image API
 * @param {string} query - Image search query
 */
export const testUnsplashAPI = async (query) => {
    console.log('🧪 Testing Unsplash API connection...');
    
    const { fetchRecipeImage } = await import('./unsplashService');
    
    try {
        // Test with a specific query
        const testQuery = query || 'pasta';
        console.log(`Testing Unsplash with query: "${testQuery}"`);
        
        const imageResult = await fetchRecipeImage(testQuery);
        
        if (imageResult && imageResult.imageUrl) {
            console.log('✅ Unsplash API test successful!', {
                imageUrl: imageResult.imageUrl.substring(0, 50) + '...',
                photographer: imageResult.photographer,
                hasUnsplashUrl: !!imageResult.unsplashUrl
            });
            return {
                success: true,
                message: 'Unsplash API test completed successfully',
                data: imageResult
            };
        } else {
            console.warn('⚠️ Unsplash returned invalid data:', imageResult);
            return {
                success: false,
                message: 'Unsplash API returned invalid data',
                data: imageResult
            };
        }
    } catch (error) {
        console.error('❌ Unsplash API test failed:', error);
        return {
            success: false,
            message: `Unsplash API test failed: ${error.message}`,
            error
        };
    }
};

/**
 * Run comprehensive API tests
 */
export const runAllTests = async () => {
    const results = {
        aiAPI: await testAIRecipeAPI('butter chicken').catch(err => ({ 
            success: false, 
            message: `Test error: ${err.message}` 
        })),
        unsplashAPI: await testUnsplashAPI('butter chicken').catch(err => ({ 
            success: false, 
            message: `Test error: ${err.message}` 
        }))
    };
    
    console.log('📊 Test Results Summary:');
    console.log(`AI Recipe API: ${results.aiAPI.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Unsplash API: ${results.unsplashAPI.success ? '✅ PASS' : '❌ FAIL'}`);
    
    return results;
};