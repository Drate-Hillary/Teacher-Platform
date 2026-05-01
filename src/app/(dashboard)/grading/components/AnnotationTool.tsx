'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Hugeicons Imports
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Edit02Icon,
  PencilIcon,
  EraserIcon,
  Comment01Icon,
  ArrowTurnBackwardIcon,
  ArrowTurnForwardIcon,
  Delete01Icon,
  Download01Icon,
  Refresh01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  MoveIcon,
  CircleIcon,
  Remove01Icon,
  TextFontIcon,
  Tick01Icon,
  Cancel01Icon,
  PaintBoardIcon,
  Layers01Icon,
  ViewIcon,
  ViewOffSlashIcon,
  SaveIcon,
  ZoomOutAreaIcon,
  ZoomInAreaIcon,
  Rectangle,
} from '@hugeicons/core-free-icons';

interface Point {
  x: number;
  y: number;
}

interface Annotation {
  id: string;
  type: 'highlight' | 'drawing' | 'text' | 'comment' | 'shape';
  points: Point[];
  color: string;
  strokeWidth: number;
  text?: string;
  page: number;
  opacity: number;
  timestamp: string;
  author: string;
}

interface AnnotationToolProps {
  documentUrl?: string;
  documentName?: string;
  totalPages?: number;
  onSave?: (annotations: Annotation[]) => void;
  readOnly?: boolean;
}

export default function AnnotationTool({
  documentUrl,
  documentName = 'Document.pdf',
  totalPages = 5,
  onSave,
  readOnly = false,
}: AnnotationToolProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [undoStack, setUndoStack] = useState<Annotation[]>([]);
  const [redoStack, setRedoStack] = useState<Annotation[]>([]);
  const [activeTool, setActiveTool] = useState<'highlight' | 'pen' | 'text' | 'shape' | 'comment' | 'eraser' | 'select'>('pen');
  const [activeColor, setActiveColor] = useState('#FFD700');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [opacity, setOpacity] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentPosition, setCommentPosition] = useState<Point | null>(null);
  const [selectedShape, setSelectedShape] = useState<'rectangle' | 'circle' | 'line'>('rectangle');
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const colors = [
    { color: '#FFD700', label: 'Yellow', icon: Edit02Icon },
    { color: '#FF6B6B', label: 'Red', icon: PencilIcon },
    { color: '#4ECDC4', label: 'Teal', icon: PencilIcon },
    { color: '#45B7D1', label: 'Blue', icon: PencilIcon },
    { color: '#96CEB4', label: 'Green', icon: PencilIcon },
    { color: '#FFEAA7', label: 'Cream', icon: Edit02Icon },
    { color: '#DDA0DD', label: 'Plum', icon: PencilIcon },
    { color: '#FF8C00', label: 'Orange', icon: PencilIcon },
  ];

  const tools = [
    { id: 'select' as const, icon: MoveIcon, label: 'Select', shortcut: 'V' },
    { id: 'pen' as const, icon: PencilIcon, label: 'Pen', shortcut: 'P' },
    { id: 'highlight' as const, icon: Edit02Icon, label: 'Highlight', shortcut: 'H' },
    { id: 'text' as const, icon: TextFontIcon, label: 'Text', shortcut: 'T' },
    { id: 'shape' as const, icon: Rectangle, label: 'Shape', shortcut: 'S' },
    { id: 'comment' as const, icon: Comment01Icon, label: 'Comment', shortcut: 'C' },
    { id: 'eraser' as const, icon: EraserIcon, label: 'Eraser', shortcut: 'E' },
  ];

  const shapes = [
    { id: 'rectangle' as const, icon: Rectangle, label: 'Rectangle' },
    { id: 'circle' as const, icon: CircleIcon, label: 'Circle' },
    { id: 'line' as const, icon: Remove01Icon, label: 'Line' },
  ];

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left - panOffset.x) * scaleX,
      y: (e.clientY - rect.top - panOffset.y) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly || activeTool === 'select' || activeTool === 'eraser') return;
    
    setIsDrawing(true);
    const point = getCanvasCoordinates(e);
    setCurrentPoints([point]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly) return;
    
    const point = getCanvasCoordinates(e);
    
    if (activeTool === 'pen' || activeTool === 'highlight') {
      setCurrentPoints(prev => [...prev, point]);
    } else {
      setCurrentPoints([currentPoints[0], point]);
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly) return;
    
    setIsDrawing(false);
    
    if (currentPoints.length > 0) {
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        type: activeTool === 'highlight' ? 'highlight' : 
              activeTool === 'text' ? 'text' :
              activeTool === 'shape' ? 'shape' : 'drawing',
        points: currentPoints,
        color: activeColor,
        strokeWidth,
        page: currentPage,
        opacity: opacity / 100,
        timestamp: new Date().toISOString(),
        author: 'Current Teacher',
      };

      if (activeTool === 'comment') {
        setCommentPosition(currentPoints[0]);
        setShowCommentInput(true);
        return;
      }

      setUndoStack([...annotations]);
      setAnnotations(prev => [...prev, newAnnotation]);
      setRedoStack([]);
    }
    
    setCurrentPoints([]);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'comment' && !isDrawing) {
      const point = getCanvasCoordinates(e);
      setCommentPosition(point);
      setShowCommentInput(true);
    }
    
    if (activeTool === 'eraser') {
      const point = getCanvasCoordinates(e);
      const clickedAnnotation = annotations.find(ann => {
        if (ann.points.length < 2) return false;
        const [start, end] = [ann.points[0], ann.points[ann.points.length - 1]];
        return point.x >= start.x && point.x <= end.x &&
               point.y >= start.y && point.y <= end.y;
      });
      
      if (clickedAnnotation) {
        setUndoStack([...annotations]);
        setAnnotations(prev => prev.filter(a => a.id !== clickedAnnotation.id));
        setRedoStack([]);
      }
    }
  };

  const handleAddComment = () => {
    if (commentPosition && commentText.trim()) {
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        type: 'comment',
        points: [commentPosition],
        color: '#FFD700',
        strokeWidth: 1,
        text: commentText,
        page: currentPage,
        opacity: 1,
        timestamp: new Date().toISOString(),
        author: 'Current Teacher',
      };
      
      setUndoStack([...annotations]);
      setAnnotations(prev => [...prev, newAnnotation]);
      setRedoStack([]);
      setCommentText('');
      setShowCommentInput(false);
    }
  };

  const handleUndo = () => {
    if (annotations.length > 0) {
      const lastAnnotation = annotations[annotations.length - 1];
      setRedoStack(prev => [...prev, lastAnnotation]);
      setAnnotations(prev => prev.slice(0, -1));
      setUndoStack(prev => prev.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const annotation = redoStack[redoStack.length - 1];
      setAnnotations(prev => [...prev, annotation]);
      setUndoStack(prev => [...prev, annotation]);
      setRedoStack(prev => prev.slice(0, -1));
    }
  };

  const handleClearAll = () => {
    setUndoStack([...annotations]);
    setAnnotations([]);
    setRedoStack([]);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(annotations);
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(annotations, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `annotations-page-${currentPage}.json`;
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* Main Toolbar */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Tools */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {tools.map((tool) => (
                <TooltipProvider key={tool.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={activeTool === tool.id ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTool(tool.id)}
                        disabled={readOnly}
                      >
                        <HugeiconsIcon icon={tool.icon} className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{tool.label} ({tool.shortcut})</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Colors */}
            <div className="flex items-center gap-1">
              {colors.slice(0, 5).map((c) => (
                <TooltipProvider key={c.color}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setActiveColor(c.color)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          activeColor === c.color ? 'border-gray-800 scale-110' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.color }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{c.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              <Select value={activeColor} onValueChange={setActiveColor}>
                <SelectTrigger className="w-8 h-8 p-0 border-0 flex items-center justify-center">
                  <HugeiconsIcon icon={PaintBoardIcon} className="h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((c) => (
                    <SelectItem key={c.color} value={c.color}>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: c.color }} />
                        {c.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Stroke Width */}
            <div className="flex items-center gap-2">
              <Label className="text-xs">Width</Label>
              <Select value={strokeWidth.toString()} onValueChange={(v) => setStrokeWidth(parseInt(v))}>
                <SelectTrigger className="w-17.5 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((w) => (
                    <SelectItem key={w} value={w.toString()}>{w}px</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Opacity */}
            <div className="flex items-center gap-2">
              <Label className="text-xs">Opacity</Label>
              <Select value={opacity.toString()} onValueChange={(v) => setOpacity(parseInt(v))}>
                <SelectTrigger className="w-17.5 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[25, 50, 75, 100].map((o) => (
                    <SelectItem key={o} value={o.toString()}>{o}%</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {activeTool === 'shape' && (
              <>
                <Separator orientation="vertical" className="h-8" />
                <div className="flex items-center gap-1">
                  {shapes.map((shape) => (
                    <Button
                      key={shape.id}
                      variant={selectedShape === shape.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedShape(shape.id)}
                    >
                      <HugeiconsIcon icon={shape.icon} className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </>
            )}

            <Separator orientation="vertical" className="h-8" />

            {/* Actions */}
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={handleUndo} disabled={annotations.length === 0}>
                      <HugeiconsIcon icon={ArrowTurnBackwardIcon} className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={handleRedo} disabled={redoStack.length === 0}>
                      <HugeiconsIcon icon={ArrowTurnForwardIcon} className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setShowAnnotations(!showAnnotations)}>
                      {showAnnotations ? (
                        <HugeiconsIcon icon={ViewIcon} className="h-4 w-4" />
                      ) : (
                        <HugeiconsIcon icon={ViewOffSlashIcon} className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle Annotations</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={handleClearAll} disabled={annotations.length === 0}>
                      <HugeiconsIcon icon={Delete01Icon} className="h-4 w-4 text-red-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clear All</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <HugeiconsIcon icon={Download01Icon} className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button size="sm" onClick={handleSave}>
                <HugeiconsIcon icon={SaveIcon} className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Canvas */}
      <Card>
        <div className="border-b p-2 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{documentName}</span>
            <Badge variant="secondary">Page {currentPage} of {totalPages}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.max(25, z - 25))}>
              <HugeiconsIcon icon={ZoomOutAreaIcon} className="h-4 w-4" />
            </Button>
            <span className="text-sm min-w-15 text-center">{zoom}%</span>
            <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.min(200, z + 25))}>
              <HugeiconsIcon icon={ZoomInAreaIcon} className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <HugeiconsIcon icon={Refresh01Icon} className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-0 relative">
          <div
            ref={containerRef}
            className="bg-gray-200 min-h-150 flex items-center justify-center overflow-hidden"
            style={{ cursor: activeTool === 'select' ? 'default' : 'crosshair' }}
          >
            <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}>
              <canvas
                ref={canvasRef}
                width={800}
                height={1000}
                className="bg-white shadow-lg"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onClick={handleCanvasClick}
              />
            </div>
          </div>

          {/* Page Navigation */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white rounded-lg shadow-lg p-2 border">
            <Button
              variant="ghost"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
            </Button>
            <span className="text-sm min-w-25 text-center">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
            </Button>
          </div>

          {/* Comment Input Popup */}
          {showCommentInput && commentPosition && (
            <div
              className="absolute bg-white rounded-lg shadow-xl border p-3 w-64"
              style={{
                left: commentPosition.x + 20,
                top: commentPosition.y - 50,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-medium">Add Comment</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setShowCommentInput(false)}
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="h-3 w-3" />
                </Button>
              </div>
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Enter your comment..."
                rows={3}
                className="text-xs"
                autoFocus
              />
              <div className="flex justify-end mt-2">
                <Button size="sm" onClick={handleAddComment} disabled={!commentText.trim()}>
                  <HugeiconsIcon icon={Tick01Icon} className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Annotations List */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <HugeiconsIcon icon={Layers01Icon} className="h-4 w-4" />
              Annotations ({annotations.length})
            </h3>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <HugeiconsIcon icon={Download01Icon} className="h-4 w-4 mr-1" />
                Export All
              </Button>
            </div>
          </div>

          {annotations.length > 0 ? (
            <div className="space-y-2 max-h-75 overflow-y-auto">
              {annotations
                .filter(a => a.page === currentPage)
                .map((annotation) => (
                  <div
                    key={annotation.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedAnnotation === annotation.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedAnnotation(annotation.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: annotation.color }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {annotation.type}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(annotation.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        {annotation.text && (
                          <p className="text-sm text-gray-700 mt-1">{annotation.text}</p>
                        )}
                        {!annotation.text && (
                          <p className="text-sm text-gray-500">
                            {annotation.type === 'highlight' ? 'Highlighted area' :
                             annotation.type === 'drawing' ? 'Freehand drawing' :
                             annotation.type === 'shape' ? 'Shape annotation' : 'Annotation'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAnnotations(prev => prev.filter(a => a.id !== annotation.id));
                        }}
                      >
                        <HugeiconsIcon icon={Delete01Icon} className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <HugeiconsIcon icon={PencilIcon} className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No annotations on this page</p>
              <p className="text-xs text-gray-500">Use the tools above to start annotating</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}