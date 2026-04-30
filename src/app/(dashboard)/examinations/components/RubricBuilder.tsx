'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Rubric } from '@/context/AssessmentContext';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Alert01Icon, ArrowDown01Icon, ArrowUp01, CheckCircle, Copy02Icon, Delete02Icon, DragDropVerticalIcon, Idea01Icon, Layers01Icon, SaveIcon, Star, ViewIcon } from '@hugeicons/core-free-icons';

interface RubricBuilderProps {
  rubric: Rubric[];
  onChange: (rubric: Rubric[]) => void;
}

export default function RubricBuilder({ rubric, onChange }: RubricBuilderProps) {
  const [expandedCriteria, setExpandedCriteria] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedCriteria(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const addCriteria = () => {
    const newCriteria: Rubric = {
      id: Date.now().toString(),
      criteria: '',
      description: '',
      maxPoints: 25,
      levels: [
        { label: 'Excellent', points: 25, description: 'Exceeds all requirements' },
        { label: 'Good', points: 20, description: 'Meets most requirements' },
        { label: 'Fair', points: 15, description: 'Meets some requirements' },
        { label: 'Needs Improvement', points: 10, description: 'Below expectations' },
      ],
    };
    onChange([...rubric, newCriteria]);
    setExpandedCriteria([...expandedCriteria, newCriteria.id]);
  };

  const removeCriteria = (id: string) => {
    onChange(rubric.filter(c => c.id !== id));
    setExpandedCriteria(prev => prev.filter(i => i !== id));
  };

  const duplicateCriteria = (id: string) => {
    const criteria = rubric.find(c => c.id === id);
    if (criteria) {
      const newCriteria = {
        ...criteria,
        id: crypto.randomUUID.toString(),
        criteria: `${criteria.criteria} (Copy)`,
      };
      const index = rubric.findIndex(c => c.id === id);
      const newRubric = [...rubric];
      newRubric.splice(index + 1, 0, newCriteria);
      onChange(newRubric);
      setExpandedCriteria([...expandedCriteria, newCriteria.id]);
    }
  };

  const updateCriteria = (id: string, updates: Partial<Rubric>) => {
    onChange(rubric.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const updateLevel = (criteriaId: string, levelIndex: number, updates: Partial<Rubric['levels'][0]>) => {
    onChange(
      rubric.map(c => {
        if (c.id === criteriaId) {
          const newLevels = [...c.levels];
          newLevels[levelIndex] = { ...newLevels[levelIndex], ...updates };
          return { ...c, levels: newLevels };
        }
        return c;
      })
    );
  };

  const addLevel = (criteriaId: string) => {
    onChange(
      rubric.map(c => {
        if (c.id === criteriaId) {
          const newLevel = {
            label: 'New Level',
            points: Math.max(...c.levels.map(l => l.points)) - 5,
            description: 'Description of this level',
          };
          return { ...c, levels: [...c.levels, newLevel] };
        }
        return c;
      })
    );
  };

  const removeLevel = (criteriaId: string, levelIndex: number) => {
    onChange(
      rubric.map(c => {
        if (c.id === criteriaId && c.levels.length > 1) {
          const newLevels = c.levels.filter((_, i) => i !== levelIndex);
          return { ...c, levels: newLevels };
        }
        return c;
      })
    );
  };

  const getTotalPoints = () => {
    return rubric.reduce((sum, criteria) => sum + criteria.maxPoints, 0);
  };

  const getLevelColor = (index: number, total: number) => {
    const ratio = index / (total - 1);
    if (ratio <= 0.25) return 'bg-green-100 border-green-300 text-green-800';
    if (ratio <= 0.5) return 'bg-blue-100 border-blue-300 text-blue-800';
    if (ratio <= 0.75) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    return 'bg-red-100 border-red-300 text-red-800';
  };

  const getLevelIcon = (index: number, total: number) => {
    if (index === 0) return <HugeiconsIcon icon={Star} />;
    if (index === total - 1) return <HugeiconsIcon icon={Alert01Icon} />;
    return <HugeiconsIcon icon={CheckCircle} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <HugeiconsIcon icon={Star} className="h-5 w-5 text-yellow-500" />
            Grading Rubric
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Define criteria and performance levels for grading
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <HugeiconsIcon icon={ViewIcon} className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button onClick={addCriteria} size="sm">
            <HugeiconsIcon icon={Add01Icon} className="h-4 w-4 mr-2" />
            Add Criteria
          </Button>
        </div>
      </div>

      {/* Rubric Content */}
      {rubric.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <HugeiconsIcon icon={Idea01Icon} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Grading Criteria</h3>
          <p className="text-sm text-gray-600 mb-4">
            Create criteria to evaluate student work systematically
          </p>
          <Button onClick={addCriteria} variant="outline">
            <HugeiconsIcon icon={Add01Icon} className="h-4 w-4 mr-2" />
            Add First Criteria
          </Button>
        </div>
      ) : previewMode ? (
        /* Preview Mode */
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-3 text-left text-sm font-semibold text-gray-700 min-w-37.5">
                    Criteria
                  </th>
                  {rubric[0]?.levels.map((level, i) => {
                    const LevelIcon = getLevelIcon(i, rubric[0].levels.length);
                    return (
                      <th
                        key={i}
                        className={`border p-3 text-center text-sm font-semibold min-w-37.5 ${
                          i === 0 ? 'text-green-700 bg-green-50' :
                          i === rubric[0].levels.length - 1 ? 'text-red-700 bg-red-50' :
                          'text-gray-700'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <HugeiconsIcon icon={Layers01Icon} className="h-4 w-4" />
                          <span>{level.label}</span>
                          <Badge variant="secondary">{level.points} pts</Badge>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rubric.map((criteria) => (
                  <tr key={criteria.id} className="hover:bg-gray-50">
                    <td className="border p-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{criteria.criteria}</p>
                        <p className="text-xs text-gray-600 mt-1">{criteria.description}</p>
                        <Badge variant="outline" className="mt-2">
                          {criteria.maxPoints} max points
                        </Badge>
                      </div>
                    </td>
                    {criteria.levels.map((level, i) => (
                      <td key={i} className="border p-3 text-sm text-gray-700">
                        {level.description}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100">
                  <td className="border p-3 text-sm font-semibold text-gray-700">
                    Total Points: {getTotalPoints()}
                  </td>
                  {rubric[0]?.levels.map((_, i) => (
                    <td key={i} className="border p-3 text-center text-sm text-gray-600">
                      --
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="space-y-4">
          {rubric.map((criteria, index) => (
            <Card
              key={criteria.id}
              className={`border-2 ${
                expandedCriteria.includes(criteria.id) ? 'border-blue-300' : 'border-gray-200'
              }`}
            >
              {/* Criteria Header */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpand(criteria.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <HugeiconsIcon icon={DragDropVerticalIcon} className="h-4 w-4 text-gray-400 cursor-move" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">
                          Criteria {index + 1}
                        </span>
                        <Badge variant="secondary">{criteria.maxPoints} pts</Badge>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {criteria.criteria || 'Untitled Criteria'}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {criteria.levels.length} performance levels
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateCriteria(criteria.id);
                      }}
                    >
                      <HugeiconsIcon icon={Copy02Icon} className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCriteria(criteria.id);
                      }}
                    >
                      <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4 text-red-500" />
                    </Button>
                    {expandedCriteria.includes(criteria.id) ? (
                      <HugeiconsIcon icon={ArrowUp01} className="h-4 w-4 text-gray-400" />
                    ) : (
                      <HugeiconsIcon icon={ArrowDown01Icon} className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedCriteria.includes(criteria.id) && (
                <div className="p-4 border-t space-y-4">
                  {/* Criteria Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Criteria Name</Label>
                      <Input
                        value={criteria.criteria}
                        onChange={(e) =>
                          updateCriteria(criteria.id, { criteria: e.target.value })
                        }
                        placeholder="e.g., Data Collection Quality"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Maximum Points</Label>
                      <Input
                        type="number"
                        value={criteria.maxPoints}
                        onChange={(e) =>
                          updateCriteria(criteria.id, {
                            maxPoints: parseInt(e.target.value) || 0,
                          })
                        }
                        min={1}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={criteria.description}
                      onChange={(e) =>
                        updateCriteria(criteria.id, { description: e.target.value })
                      }
                      placeholder="Describe what this criteria evaluates..."
                      rows={2}
                    />
                  </div>

                  <Separator />

                  {/* Performance Levels */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-base">Performance Levels</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addLevel(criteria.id)}
                      >
                        <HugeiconsIcon icon={Add01Icon} className="h-3 w-3 mr-1" />
                        Add Level
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {criteria.levels.map((level, levelIndex) => {
                        const LevelIcon = getLevelIcon(levelIndex, criteria.levels.length);
                        return (
                          <div
                            key={levelIndex}
                            className={`border rounded-lg p-4 ${
                              levelIndex === 0
                                ? 'bg-green-50 border-green-200'
                                : levelIndex === criteria.levels.length - 1
                                ? 'bg-red-50 border-red-200'
                                : 'bg-white'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`p-1.5 rounded-lg ${
                                    levelIndex === 0
                                      ? 'bg-green-200'
                                      : levelIndex === criteria.levels.length - 1
                                      ? 'bg-red-200'
                                      : 'bg-gray-200'
                                  }`}
                                >
                                  <HugeiconsIcon icon={Layers01Icon} className="h-4 w-4" />
                                </div>
                                <Badge variant="secondary">{level.points} points</Badge>
                              </div>
                              {criteria.levels.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeLevel(criteria.id, levelIndex)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label className="text-xs">Label</Label>
                                <Input
                                  value={level.label}
                                  onChange={(e) =>
                                    updateLevel(criteria.id, levelIndex, {
                                      label: e.target.value,
                                    })
                                  }
                                  placeholder="e.g., Excellent"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs">Points</Label>
                                <Input
                                  type="number"
                                  value={level.points}
                                  onChange={(e) =>
                                    updateLevel(criteria.id, levelIndex, {
                                      points: parseInt(e.target.value) || 0,
                                    })
                                  }
                                  min={0}
                                  max={criteria.maxPoints}
                                />
                              </div>
                            </div>

                            <div className="mt-2 space-y-2">
                              <Label className="text-xs">Description</Label>
                              <Textarea
                                value={level.description}
                                onChange={(e) =>
                                  updateLevel(criteria.id, levelIndex, {
                                    description: e.target.value,
                                  })
                                }
                                placeholder="Describe expectations for this level..."
                                rows={2}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      {rubric.length > 0 && (
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-gray-600">Criteria: </span>
              <span className="font-medium text-gray-900">{rubric.length}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Total Points: </span>
              <span className="font-medium text-blue-600">{getTotalPoints()}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Avg Levels: </span>
              <span className="font-medium text-gray-900">
                {rubric.length > 0
                  ? (rubric.reduce((sum, c) => sum + c.levels.length, 0) / rubric.length).toFixed(1)
                  : 0}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {previewMode ? 'Edit Rubric' : 'Preview Rubric'}
            </button>
          </div>
        </div>
      )}

      {/* Save Template Option */}
      {rubric.length > 0 && !previewMode && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Save rubric as template logic
              console.log('Saving rubric template:', rubric);
            }}
          >
            <HugeiconsIcon icon={SaveIcon} className="h-4 w-4 mr-2" />
            Save as Template
          </Button>
        </div>
      )}
    </div>
  );
}