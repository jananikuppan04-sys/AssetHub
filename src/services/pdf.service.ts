import PDFDocument from 'pdfkit';
import logger from '../utils/logger';

class PDFService {
  async generateReport(title: string, columns: string[], data: any[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        const buffers: Buffer[] = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Title
        doc.fontSize(20).text(title, { align: 'center' });
        doc.moveDown(2);

        // Very basic table layout
        let y = doc.y;
        doc.fontSize(10);
        
        // Headers
        columns.forEach((col, i) => {
          doc.text(col, 30 + (i * 100), y, { width: 90 });
        });
        
        y += 20;
        doc.moveTo(30, y - 5).lineTo(550, y - 5).stroke();

        // Rows
        data.forEach(row => {
          if (y > 750) {
            doc.addPage();
            y = 50;
          }
          columns.forEach((col, i) => {
            const val = row[col] ? String(row[col]).substring(0, 20) : '';
            doc.text(val, 30 + (i * 100), y, { width: 90 });
          });
          y += 20;
        });

        doc.end();
      } catch (error) {
        logger.error('PDF Generation Error', error);
        reject(error);
      }
    });
  }
}

export const pdfService = new PDFService();
