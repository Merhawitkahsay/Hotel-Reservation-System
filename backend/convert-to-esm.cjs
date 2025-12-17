const fs = require('fs');
const path = require('path');

const files = [
    'server.js',
    'app.js',
    'src/config/database.js',
    'src/config/env.js',
    'src/controllers/authController.js',
    'src/middleware/authMiddleware.js',
    'src/middleware/roleMiddleware.js',
    'src/routes/authRoutes.js',
    'src/utils/jwtUtils.js',
    'src/utils/validation.js',
    'database/seed.js'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Convert require to import
        content = content.replace(/const\s+{?\s*([\w\s{},]+)\s*}?\s*=\s*require\(['"]([^'"]+)['"]\);?/g, (match, vars, module) => {
            if (module.startsWith('./') || module.startsWith('../')) {
                return `import ${vars} from '${module}.js';`;
            } else {
                return `import ${vars} from '${module}';`;
            }
        });
        
        // Convert module.exports to export
        content = content.replace(/module\.exports\s*=\s*{([^}]+)}/g, 'export { $1 }');
        content = content.replace(/module\.exports\s*=\s*(\w+);/g, 'export default $1;');
        content = content.replace(/module\.exports\s*=\s*([^;]+);/g, 'export default $1;');
        
        // Add __dirname fix
        if (content.includes('__dirname')) {
            content = `import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

` + content;
        }
        
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✅ Converted: ${file}`);
    }
});

console.log('🎉 All files converted to ES Modules!');
